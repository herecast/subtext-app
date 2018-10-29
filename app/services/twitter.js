import { set, get } from '@ember/object';
import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import $ from 'jquery';

export default Service.extend({
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
