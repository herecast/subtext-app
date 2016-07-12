import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';
import SocialSharing from 'subtext-ui/utils/social-sharing';
/* global FB */

const {
  computed,
  get,
  set,
  inject
} = Ember;

export default Ember.Component.extend(TrackEvent, {
  classNames: ['SocialShare'],

  toast: inject.service(),

  isCaching: false,

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

      window.location.href = mailto;
    },

    shareFacebook() {
      const toast = get(this, 'toast');
      set(this, 'isCaching', true);

      SocialSharing.checkFacebookCache().then(() => {
        set(this, 'isCaching', false);
        FB.ui({
          method: 'share',
          href: `${location.protocol}//${location.host}${location.pathname}`
        }, function(){});
      }, (error) => {
        set(this, 'isCaching', false);
        toast.error(`Error: ${error} Please try again.`);
      });

    }
  }
});
