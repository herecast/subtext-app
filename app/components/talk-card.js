import Ember from 'ember';

export default Ember.Component.extend({
  title: Ember.computed.oneWay('talk.title'),

  numberText: function() {
    const count = this.get('talk.userCount');

    if (count === 1) {
      return 'person';
    } else {
      return 'people';
    }
  }.property('talk.userCount'),

  viewText: function() {
    const count = this.get('talk.pageviewsCount');

    if (count === 1) {
      return 'view';
    } else {
      return 'views';
    }
  }.property('talk.pageviewsCount')
});
