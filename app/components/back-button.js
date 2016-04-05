import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  history: Ember.inject.service('history'),

  routeName: computed('history.routeName', 'defaultRouteName', function() {
    return this.get('history.routeName') || this.get('defaultRouteName');
  })
});
