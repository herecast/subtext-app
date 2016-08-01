import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import moment from 'moment';
/* global FB */

const {
  computed,
  get,
  set,
  inject,
  run
} = Ember;

export default Ember.Component.extend(TrackEvent, {
  classNames: ['SocialShare'],
  isTalkChannel: false,

  updatedAt: null,

  toast: inject.service(),
  delayedJobs: inject.service(),

  isCaching: false,

  init() {
    this._super(...arguments);
    if (get(this, 'updatedAt')){
      const timeSinceUpdate = this.secondsSinceUpdate();
      //If less than a minute since updated, wait until end of minute, then facebook recache
      if (timeSinceUpdate > 0 && timeSinceUpdate < 60) {
        const secondsToWait = Math.round(60 - timeSinceUpdate);
        const toast = get(this, 'toast');
        const sharePath = window.location.pathname;

        set(this, 'isCaching', true);
        let text = `Give it about ${secondsToWait} seconds. If you want share to FB - please don’t leave the page.`;
        let title = 'Facebook Share Loading...';

        toast.clear();
        toast.warning(text, title, {
          timeOut: secondsToWait * 1e3
        });

        let delayedJob =
          run.later(this, () => {
            SocialSharing.checkFacebookCache(sharePath).then(() => {
              set(this, 'isCaching', false);
              toast.clear();
              toast.success('Facebook sharing is ready');
            });
          }, secondsToWait * 1e3);

        get(this, 'delayedJobs').queueJob(`facebookRecache${sharePath}`, delayedJob);
      }
    }
  },

  secondsSinceUpdate() {
    const updatedAt = get(this, 'updatedAt').utc();
    const now = moment().utc();

    return now.diff(updatedAt) * 1e-3;
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
    const url = `${location.protocol}//${location.host}${location.pathname}`;
    const via = 'thedailyUV';
    const hashtags = 'UpperValley';

    return Ember.String.htmlSafe(`http://twitter.com/intent/tweet?text=${title}&url=${url}&via=${via}&hashtags=${hashtags}`);
  }),

  actions: {
    shareEmail() {
      const mailto = get(this, 'mailtoLink');

      window.location.href = mailto;
    },

    shareFacebook() {
      FB.ui({
        method: 'share',
        mobile_iframe: true,
        hashtag: '#UpperValley',
        href: `${location.protocol}//${location.host}${location.pathname}`
      }, () => {});
    }
  }
});
