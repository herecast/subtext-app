import Ember from 'ember';

export default Ember.Controller.extend({
  secondaryBackground: true,
  isPreview: true,

  actions: {
    trackEventInfoClick(type) {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Event Info',
        navControl: type
      });
    },
  }
});
