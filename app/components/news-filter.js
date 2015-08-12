import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],
  refreshParam: Ember.inject.service('refresh-param'),
  mixpanel: Ember.inject.service('mixpanel'),

  actions: {
    submit() {
      const filterParams = this.getProperties('publication', 'query', 'location');

      filterParams.r = this.get('refreshParam.time');

      this.get('mixpanel').trackEvent('News Search', {
        'Publication': this.get('category'),
        'Query': this.get('query'),
        'Location': this.get('location')
      });

      this.sendAction('updateFilter', filterParams);
    }
  }
});
