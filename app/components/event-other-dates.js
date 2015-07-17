import Ember from 'ember';

const initialCount = 3;

export default Ember.Component.extend({
  showAll: false,

  eventInstances: function() {
    const instance = this.get('instance');

    if (instance) {
      return instance.get('eventInstances').filter((item) => {
        const differentInstance = instance.get('id') !== item.get('id');
        const isUpcoming = item.get('startsAt').isAfter();

        return differentInstance && isUpcoming;
      });
    } else {
      return [];
    }
  }.property('instance.eventInstances.[]'),

  hasMore: function() {
    return this.get('eventInstances.length') > initialCount;
  }.property('eventInstances.[]'),

  instancesToDisplay: function() {
    const allContent = this.get('eventInstances');

    if (this.get('showAll')) {
      return allContent;
    } else {
      return allContent.slice(0, initialCount);
    }
  }.property('eventInstances.[]', 'showAll'),

  actions: {
    toggleMore() {
      this.toggleProperty('showAll');
    }
  }
});
