import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],
  mixpanel: Ember.inject.service('mixpanel'),

  actions: {
    submit() {
      const filterParams = this.getProperties('query', 'location');

      this.get('mixpanel').trackEvent('Market Search', {
        'Query': this.get('query'),
        'Location': this.get('location')
      });

      this.sendAction('updateFilter', filterParams);
    }
  }
});
