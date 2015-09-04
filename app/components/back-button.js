import Ember from 'ember';

export default Ember.Component.extend({
  history: Ember.inject.service('history'),

  routeName: function() {
    return this.get('history.routeName') || this.get('defaultRouteName');
  }.property('history.routeName', 'defaultRouteName')
});
