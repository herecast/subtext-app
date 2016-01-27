import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';
/* global FB */

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend(TrackEvent, {
  classNames: ['SocialShare'],

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

  actions: {
    shareEmail() {
      const mailto = get(this, 'mailtoLink');

      this.trackEvent('selectNavControl', {
        navControlGroup: 'Share Buttons',
        navControl: 'email'
      });

      window.open(mailto, '_blank');
    },

    shareFacebook() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Share Buttons',
        navControl: 'facebook'
      });

      FB.ui({
        method: 'share',
        href: `${location.protocol}//${location.host}${location.pathname}`
      }, function(){});
    }
  }
});
