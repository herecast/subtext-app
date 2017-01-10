import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import sanitize from 'npm:sanitize-html';

const {get,inject} = Ember;

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

    const url = SocialSharing.getShareUrl(locationService, routeName, model);
    const imageUrl = get(model, 'imageUrl') || get(model,'featuredImageUrl') || this.defaultImage(channel);
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
        attrs: {
          property: 'fb:app_id',
          content:  config['FACEBOOK_APP_ID'],
        }
      },
      {
        type: 'meta',
        attrs: {
          property: 'og:site_name',
          content: 'dailyUV'
        }
      },
      {
        type: 'meta',
        attrs: {
          property: 'og:image',
          content: imageUrl
        }
      },
      {
        type: 'meta',
        attrs: {
          property: 'og:title',
          content: title
        }
      },
      {
        type: 'meta',
        attrs: {
          property: 'og:description',
          content: descriptionTruncated
        }
      },
      {
        type: 'meta',
        attrs: {
          property: 'og:url',
          content: url
        }
      },
      {
        type: 'meta',
        attrs: {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      },
      {
        type: 'meta',
        attrs: {
          name: 'twitter:site',
          content: '@thedailyUV'
        }
      },
      {
        type: 'meta',
        attrs: {
          name: 'twitter:creator',
          content: '@thedailyUV'
        }
      },
      {
        type: 'meta',
        attrs: {
          name: 'twitter:url',
          content: url
        }
      },
      {
        type: 'meta',
        attrs: {
          name: 'twitter:title',
          content: title
        }
      },
      {
        type: 'meta',
        attrs: {
          name: 'twitter:description',
          content: descriptionTruncated
        }
      },
      {
        type: 'meta',
        attrs: {
          name: 'twitter:image',
          content: imageUrl
        }
      }
    ];
  },

  links() {
    const model = this.modelForMetaTags();
    const routeName = this.routeName;
    const locationService = get(this, 'location');

    return {
      canonical: SocialSharing.getShareUrl(locationService, routeName, model)
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
    return (description.length > characters) ? description.substr(0, characters-1) + '...' : description;
  }
});
