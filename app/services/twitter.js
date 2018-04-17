import $ from 'jquery';
import Ember from 'ember';

const { get, set, RSVP:{Promise}, inject:{service} } = Ember;

export default Ember.Service.extend({
  fastboot: service(),
  twitterInitPromise: null,
  isLoaded: false,

  preload() {
    if (!get(this, 'fastboot.isFastBoot') && !get(this, 'isLoaded')) {
      this._loadTwitter().then(() => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'isLoaded', true);
        }
      });
    }
  },

  _loadTwitter() {
    if (this.twitterInitPromise) { return this.twitterInitPromise; }

    this.twitterInitPromise = new Promise((resolve) => {
      $.getScript(`https://platform.twitter.com/widgets.js`, function() {
        resolve();
      });
    });

    return this.twitterInitPromise;
  }
});
