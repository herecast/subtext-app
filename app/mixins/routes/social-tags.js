import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';
import SocialSharing from 'subtext-ui/utils/social-sharing';

const {get} = Ember;

export default Ember.Mixin.create(RouteMetaMixin, {

  isModalContent: false,
  // Override where needed
  modelForMetaTags: function() {
    const routeName = this.routeName;
    const isModalRoute = SocialSharing.isModalRoute(routeName);

    return isModalRoute ? this.currentModel : this.modelFor(routeName);
  },

  meta() {
    const model = this.modelForMetaTags();
    const routeName = this.routeName;
    const isModalRoute = SocialSharing.isModalRoute(routeName);

    let channel;

    if (isModalRoute) {
      channel = get(this, 'channel') || 'base';
    } else {
      channel = get(this, 'modelChannel') || 'base';
    }

    const url = SocialSharing.getShareUrl(routeName, model);
    const imageUrl = get(model, 'imageUrl') || this.defaultImage(channel);
    const title = get(model, 'title');

// Strip out all HTML tags from the content so it can be used for the description
    let tmp = document.createElement("DIV");
    tmp.innerHTML = model.get('content');
    const description = tmp.textContent || tmp.innerText || "";
    const descriptionTruncated = this.truncateDescription(description);

    let metaProperty = {
      'property': {
        'fb:app_id': config['facebook-app-id'],
        'og:site_name': 'dailyUV',
        'og:image': imageUrl,
        'og:title': title,
        'og:description': descriptionTruncated,
        'og:url': url,
      },
      'name': {
        'twitter:card': 'summary_large_image',
        'twitter:site': '@thedailyUV',
        'twitter:creator': '@thedailyUV',
        'twitter:url': url,
        'twitter:title': title,
        'twitter:description': descriptionTruncated,
        'twitter:image': imageUrl
      }
    };

    return metaProperty;
  },

  links() {
    const model = this.modelForMetaTags();
    const routeName = this.routeName;

    return {
      canonical: SocialSharing.getShareUrl(routeName, model)
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
