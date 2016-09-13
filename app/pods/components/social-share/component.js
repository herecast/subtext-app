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
  isPreview: false,
  isTalkChannel: false,

  model: null,

  toast: inject.service(),
  delayedJobs: inject.service(),

  canShare: true,

  didInsertElement() {
    this._super(...arguments);

    if (this.hasBeenUpdated() && this.updatedBuffer()) {
      this.showShareWarning();
    }
  },

  secondsSinceUpdate() {
    const updatedAt = get(this, 'model.updatedAt');
    const now = moment().utc();

    if (updatedAt) {
      return now.diff(updatedAt.utc()) * 1e-3;
    } else {
      return 0;
    }
  },

  hasBeenUpdated() {
    const updatedAt = get(this, 'model.updatedAt');
    const createdAt = get(this, 'model.createdAt');

    let hasBeenUpdated = false;
    if (updatedAt && createdAt) {
      hasBeenUpdated = (updatedAt.diff(createdAt) * 1e-3) > 15;
    }
    return hasBeenUpdated;
  },

  updatedBuffer() {
    const timeSinceUpdate = this.secondsSinceUpdate();

    if (timeSinceUpdate > 0 && timeSinceUpdate < 60) {
      return Math.round(60 - timeSinceUpdate);
    } else {
      return 0;
    }
  },

  showShareWarning() {
    const secondsToWait = this.updatedBuffer();

    if (secondsToWait) {
      const toast = get(this, 'toast');
      const sharePath = window.location.pathname;

      set(this, 'canShare', false);
      let text = `Give it about ${secondsToWait} seconds. If you want share to FB - please don’t leave the page.`;
      let title = 'Facebook Share Loading...';

      toast.clear();
      toast.warning(text, title, {
        timeOut: secondsToWait * 1e3,
        extendedTimeOut: 0,
        closeOnHover: false
      });

      let delayedJob =
        run.later(this, () => {
          SocialSharing.checkFacebookCache(sharePath).then(() => {
            set(this, 'canShare', true);
            toast.clear();
            toast.success('Facebook sharing is ready');
          });
        }, secondsToWait * 1e3);

      get(this, 'delayedJobs').queueJob(`facebookRecache${sharePath}`, delayedJob);
    }
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
      const isPreview = get(this, 'isPreview');
      if(!isPreview) {
        const mailto = get(this, 'mailtoLink');

        window.location.href = mailto;
      }
    },

    shareFacebook() {
      if( get(this, 'canShare') && this.updatedBuffer() <= 0) {
        FB.ui({
          method: 'share',
          mobile_iframe: true,
          hashtag: '#UpperValley',
          href: `${location.protocol}//${location.host}${location.pathname}`
        }, () => {});
      } else {
        //still caching
        this.showShareWarning();
      }
    }
  }
});
