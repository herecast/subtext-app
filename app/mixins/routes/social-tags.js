import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import sanitize from 'npm:sanitize-html';
import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';

const {get, inject} = Ember;

export default Ember.Mixin.create({
  location: inject.service('window-location'),
  isModalContent: false,
  // Override where needed
  modelForMetaTags: function() {
    const routeName = this.routeName;
    const isModalRoute = SocialSharing.isModalRoute(routeName);

    return isModalRoute ? this.currentModel : this.modelFor(routeName);
  },

  headTags() {
    const model = this.modelForMetaTags();
    const routeName = this.routeName;
    const isModalRoute = SocialSharing.isModalRoute(routeName);
    const locationService = get(this, 'location');

    let channel;

    if (isModalRoute) {
      channel = get(this, 'channel') || 'base';
    } else {
      channel = get(this, 'modelChannel') || 'base';
    }

    const fromProfile = routeName.startsWith('profile');
    const url = SocialSharing.getShareUrl(locationService, model, fromProfile);
    const imageUrl = get(model,'featuredImageUrl') || get(model, 'imageUrl') || this.defaultImage(channel);
    const imageWidth = get(model, 'featuredImageWidth') || get(model, 'imageWidth') || 266;
    const imageHeight = get(model, 'featuredImageHeight') || get(model, 'imageHeight') || 200;
    const optimizedImageUrl = makeOptimizedImageUrl(imageUrl, imageWidth, imageHeight, true);
    const title = get(model, 'title');

    // Strip out all HTML tags from the content so it can be used for the description
    const description = sanitize(model.get('content'), {
      allowedTags: [],
      allowedAttributes: []
    });

    const descriptionTruncated = this.truncateDescription(description);

    return [
      {
        type: 'meta',
        tagId: 'meta-fb-app-id',
        attrs: {
          property: 'fb:app_id',
          content:  config['FACEBOOK_APP_ID'],
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-site-name',
        attrs: {
          property: 'og:site_name',
          content: 'dailyUV'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image',
        attrs: {
          property: 'og:image',
          content: optimizedImageUrl,
          media: 'all'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-width',
        attrs: {
          property: 'og:image:width',
          content: imageWidth,
          media: 'all'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-height',
        attrs: {
          property: 'og:image:height',
          content: imageHeight,
          media: 'all'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-title',
        attrs: {
          property: 'og:title',
          content: title
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-description',
        attrs: {
          property: 'og:description',
          content: descriptionTruncated
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-url',
        attrs: {
          property: 'og:url',
          content: url
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-card',
        attrs: {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-site',
        attrs: {
          name: 'twitter:site',
          content: '@thedailyUV'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-creator',
        attrs: {
          name: 'twitter:creator',
          content: '@thedailyUV'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-url',
        attrs: {
          name: 'twitter:url',
          content: url
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-title',
        attrs: {
          name: 'twitter:title',
          content: title
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-description',
        attrs: {
          name: 'twitter:description',
          content: descriptionTruncated
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-image',
        attrs: {
          name: 'twitter:image',
          content: imageUrl
        }
      },
      {
        type: 'meta',
        tagId: 'meta-language',
        attrs: {
          name: 'language',
          content: 'English'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-content-language',
        attrs: {
          "http-equiv": 'content-language',
          content: 'en'
        }
      }
    ];
  },

  links() {
    const model = this.modelForMetaTags();
    const locationService = get(this, 'location');

    return {
      canonical: SocialSharing.getShareUrl(locationService, model)
    };
  },

  defaultImage(channel) {
    const defaultImages = {
      base: 'https://s3.amazonaws.com/knotweed/duv/Default_Photo_dailyUV-01-1.jpg',
      news: 'https://s3.amazonaws.com/knotweed/duv/Default_Photo_News-01-1.jpg',
      market: 'https://s3.amazonaws.com/knotweed/duv/Default_Photo_Market-01-1.jpg',
      events: 'https://s3.amazonaws.com/knotweed/duv/Default_Photo_Events-01-1.jpg',
      talk: 'https://s3.amazonaws.com/knotweed/duv/Default_Photo_Talk-01-1.jpg'
    };

    return defaultImages[channel];
  },

  truncateDescription(description, characters=300) {
    description = description.replace(/\s/g, ' ');
    return (description.length > characters) ? description.substr(0, characters-1) + '...' : description;
  }
});
