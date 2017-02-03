import Ember from 'ember';
import SocialSharing from 'subtext-ui/utils/social-sharing';
/* global FB */

const {
  computed,
  get,
  inject
} = Ember;

export default Ember.Component.extend({
  location: inject.service('window-location'),
  classNames: ['SocialShare'],
  isPreview: false,
  isTalkChannel: false,

  model: null,

  routing: inject.service('-routing'),
  intercom: inject.service(),

  urlForShare() {
    const routeName = get(this, 'routing.currentRouteName');
    const model = get(this, 'model');
    const locationService = get(this, 'location');

    return SocialSharing.getShareUrl(locationService, routeName, model);
  },

  mailtoLink: computed('title', 'sharedBy', function() {
    const href = `${location.protocol}//${location.host}${location.pathname}`;
    const title = encodeURIComponent(get(this, 'title'));
    const sharedBy = get(this, 'sharedBy');
    const subject = `Shared with you: ${title}`;
    let body;

    if (sharedBy) {
      body = `${sharedBy} shared the following content from dailyUV.com with you: ${href}`;
    } else {
      body = `I want to share the following content from dailyUV.com with you: ${href}`;
    }

    return `mailto:?subject=${subject}&body=${body}`;
  }),

  twitterLink: computed('title', function() {
    const title = encodeURIComponent(get(this, 'title'));
    const url = this.urlForShare();
    const via = 'thedailyUV';
    const hashtags = 'UpperValley';

    return Ember.String.htmlSafe(`http://twitter.com/intent/tweet?text=${title}&url=${url}&via=${via}&hashtags=${hashtags}`);
  }),

  actions: {
    shareEmail() {
      const isPreview = get(this, 'isPreview');
      if(!isPreview) {
        const mailto = get(this, 'mailtoLink');

        window.location.href = mailto;
      }
    },

    shareFacebook() {
      const urlForShare = this.urlForShare();
      //for live debug
      console.info(`Share to facebook of ${urlForShare}`);

      FB.ui({
        method: 'share',
        mobile_iframe: true,
        hashtag: '#UpperValley',
        href: urlForShare
      }, (response) => {
        if (response && !response.error_message) {
          get(this, 'intercom').trackEvent('facebook-share');
        }
      });
    }
  }
});
