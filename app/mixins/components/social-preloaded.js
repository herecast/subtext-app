import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import { set, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
  facebook: service(),
  twitter: service(),

  hasActiveListeners: false,
  //Overrideable in component
  socialPreloadedOnDidInsert: false,

  didInsertElement() {
    if (!get(this, 'facebook.isLoaded') || !get(this, 'twitter.isLoaded')) {
      if (get(this, 'socialPreloadedOnDidInsert')) {
        get(this, 'facebook').preload();
        get(this, 'twitter').preload();
      } else {
        this._startListeners();
      }
    }
    this._super(...arguments);
  },

  willDestroyElement() {
    if (get(this, 'hasActiveListeners')) {
      this._destroyListeners();
    }
    this._super(...arguments);
  },

  _preloadSocialScripts(context) {
    const that = context.data;
    get(that, 'facebook').preload();
    get(that, 'twitter').preload();
    that._destroyListeners();
  },

  _startListeners() {
    set(this, 'hasActiveListeners', true);
    $(document).on('touchstart.social', this, this._preloadSocialScripts);
    $(window).on('scroll.social', this, this._preloadSocialScripts);
    $('.Modal-dialog-body').on('scroll.social', this, this._preloadSocialScripts);
  },

  _destroyListeners() {
    $(document).off('touchstart.social');
    $(window).off('scroll.social');
    $('.Modal-dialog-body').off('scroll.social');
    set(this, 'hasActiveListeners', false);
  }
});
