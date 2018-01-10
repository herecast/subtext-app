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
  logger: inject.service(),
  classNames: ['SocialShare u-flexRow'],
  isPreview: false,
  isTalkChannel: false,

  model: null,

  routing: inject.service('-routing'),
  intercom: inject.service(),

  urlForShare() {
    const model = get(this, 'model');
    const locationService = get(this, 'location');
    const routeName = get(this,'routing.router.currentRouteName') || '';
    const fromProfile = routeName.startsWith('profile');

    return SocialSharing.getShareUrl(locationService, model, fromProfile);
  },

  mailtoLink: computed('title', 'sharedBy', function() {
    const href = this.urlForShare();
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

  twitterLink: computed('title', 'authorName', 'twitterHandle', function() {
    const authorName = get(this, 'authorName');
    const twitterHandle = get(this, 'twitterHandle');
    const title = get(this, 'title');
    let twitterTitle;

    if(twitterHandle) {
      twitterTitle = encodeURIComponent(`${title} - by ${twitterHandle} on DailyUV`);
    } else if(authorName && authorName !== 'DailyUV') {
      twitterTitle = encodeURIComponent(`${title} - by ${authorName} on DailyUV`);
    } else {
      twitterTitle = encodeURIComponent(`${title} on DailyUV`);
    }

    const url = this.urlForShare();
    const hashtags = 'UpperValley';

    return Ember.String.htmlSafe(`http://twitter.com/intent/tweet?text=${twitterTitle}&url=${url}&hashtags=${hashtags}`);
  }),

  orgHashtag: computed('model.organization.name', function(){
    const orgName = get(this, 'model.organization.name');
    const content_type = get(this, 'model.contentType');
    if (content_type === 'news' && orgName) {
      const formattedOrgName = orgName.replace(/[^a-zA-Z0-9]/g, '');
      return `#${formattedOrgName}`;
    } else {
      return '';
    }
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
      const orgHashtag = get(this, 'orgHashtag');

      //for live debug
      get(this, 'logger').info(`Share to facebook of ${urlForShare}`);

      FB.ui({
        method: 'share',
        mobile_iframe: true,
        hashtag: orgHashtag,
        href: urlForShare
      }, (response) => {
        if (response && !response.error_message) {
          get(this, 'intercom').trackEvent('facebook-share');
        }
      });
    }
  }
});
