import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Mixin.create({
  mixpanel: inject.service(),

  trackEvent(callback, arg) {
    const trackingArguments = get(this, '_getTrackingArguments').call(this, arg);

    get(this, 'mixpanel').trackEventVersion2(callback, trackingArguments);
  },

  actions: {
    trackEvent(callback, arg) {
      this.trackEvent(callback, arg);
    }
  }
});
