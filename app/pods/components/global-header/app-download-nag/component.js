import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'GlobalHeader-AppDownloadNag',

  fastboot: service(),
  media: service(),

  buttonLink: '',

  init() {
    this._super(...arguments);

    if (!get(this, 'fastboot.isFastBoot')) {
      this._setupButtonLink();

      this.tracking.trackAppDownloadNagEvent('show-nag');
    }
  },

  _setupButtonLink() {
    let buttonLink = '';

    if (get(this, 'media.isMobileIOS')) {
      buttonLink = 'itmss://apps.apple.com/us/app/herecast-us/id1386402414';
    } else if (get(this, 'media.isMobileAndroid')) {
      buttonLink = 'https://play.google.com/store/apps/details?id=com.subtext.android.dailyuv';
    }

    set(this, 'buttonLink', buttonLink);
  },

  actions: {
    closeNag() {
      this.tracking.trackAppDownloadNagEvent('close-nag');

      if (get(this, 'onClose')) {
        get(this, 'onClose')();
      }
    },

    clickForStore() {
      if (get(this, 'media.isMobileIOS')) {
        this.tracking.trackAppDownloadNagEvent('click-apple-store');
      } else if (get(this, 'media.isMobileAndroid')) {
        this.tracking.trackAppDownloadNagEvent('click-android-store');
      }
    }
  }
});
