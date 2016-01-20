import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Mixin.create({
  mixpanel: inject.service(),

  // Use in templates that need to track multiple events where the tracking
  // arguments are different.
  trackEvent(eventName, trackingArguments) {
    get(this, 'mixpanel').trackEventVersion2(eventName, trackingArguments);
  },

  actions: {
    // Trigger in templates that only track a single event. If a template needs
    // to track more than one different event, trackingArguments must be
    // manually passed to the trackEvent function above.
    trackEvent(eventName, arg) {
      const trackingArguments = this._getTrackingArguments(arg);

      this.trackEvent(eventName, trackingArguments);
    }
  }
});
