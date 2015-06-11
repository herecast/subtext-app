import Ember from 'ember';

export default Ember.Mixin.create({
  mixpanel: Ember.inject.service('mixpanel'),

  actions: {
    didTransition: function() {
      this.get('mixpanel').trackPageView(this.routeName);

      return true;
    }
  }
});
