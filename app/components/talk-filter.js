import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['FilterBar navbar navbar-default'],

  mixpanel: Ember.inject.service('mixpanel'),
  session: Ember.inject.service('session'),
  refreshParam: Ember.inject.service('refresh-param'),

  actions: {
    submit() {
      const filterParams = this.getProperties('query');

      filterParams.r = this.get('refreshParam.time');

      this.get('mixpanel').trackEvent('Talk Search', {
        'Query': this.get('query')
      });

      this.sendAction('updateFilter', filterParams);
    }
  }
});
