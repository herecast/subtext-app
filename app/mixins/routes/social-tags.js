import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';

export default Ember.Mixin.create(RouteMetaMixin, {
  // Override where needed
  modelForMetaTags: function() {
    return this.modelFor(this.routeName);
  },

  meta() {
    const model = this.modelForMetaTags();
    const imageKey = this.get('modelImageKey');
    const channel = this.get('modelChannel') || 'base';

// Strip out all HTML tags from the content so it can be used for the description
    let tmp = document.createElement("DIV");
    tmp.innerHTML = model.get('content');
    const description = tmp.textContent || tmp.innerText || "";
    const descriptionTruncated = this.truncateDescription(description);
    const url = `${location.protocol}//${location.host}${location.pathname}`;

    let metaProperty = {
      'property': {
        'fb:app_id': config['facebook-app-id'],
        'og:site_name': 'dailyUV',
        'og:image': model.get(imageKey) || this.defaultImage(channel),
        'og:title': model.get('title'),
        'og:description': descriptionTruncated,
        'og:url': url,
      },
      'name': {
        'twitter:card': 'summary_large_image',
        'twitter:site': '@thedailyUV',
        'twitter:creator': '@thedailyUV',
        'twitter:url': url,
        'twitter:title': model.get('title'),
        'twitter:description': descriptionTruncated,
        'twitter:image': model.get(imageKey) || this.defaultImage(channel)
      }
    };

    if (channel === 'news') {
      metaProperty.property['og:site_name'] = `${model.get('organizationName')} | dailyUV`;
    }

    return metaProperty;

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
