import Ember from 'ember';

const { get, set, inject:{service}} = Ember;

export default Ember.Mixin.create({
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
    Ember.$(document).on('touchstart.social', this, this._preloadSocialScripts);
    Ember.$(window).on('scroll.social', this, this._preloadSocialScripts);
    Ember.$('.Modal-dialog-body').on('scroll.social', this, this._preloadSocialScripts);
  },

  _destroyListeners() {
    Ember.$(document).off('touchstart.social');
    Ember.$(window).off('scroll.social');
    Ember.$('.Modal-dialog-body').off('scroll.social');
    set(this, 'hasActiveListeners', false);
  }
});
