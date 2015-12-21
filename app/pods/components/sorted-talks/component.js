import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  talks: [],

  sortedTalks: computed('talks.@each.publishedAt', function() {
    const talks = this.get('talks').sortBy('publishedAt').toArray().reverse();

    return talks;
  })
});
