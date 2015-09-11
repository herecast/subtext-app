import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],

  mixpanel: Ember.inject.service('mixpanel'),

  actions: {
    submit() {
      const filterParams = this.getProperties('query');

      this.get('mixpanel').trackEvent('Talk Search', {
        'Query': this.get('query')
      });

      this.sendAction('updateFilter', filterParams);
    }
  }
});
