import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],
  mixpanel: Ember.inject.service('mixpanel'),

  actions: {
    submit() {
      const filterParams = this.getProperties(
        'publication', 'query', 'location', 'locationId'
      );

      this.get('mixpanel').trackEvent('News Search', {
        'Publication': this.get('category'),
        'Query': this.get('query'),
        'Location': this.get('location')
      });

      this.sendAction('updateFilter', filterParams);
    }
  }
});
