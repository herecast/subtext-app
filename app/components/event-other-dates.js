import Ember from 'ember';

export default Ember.Component.extend({
  showAll: false,

  eventInstances: function() {
    const instance = this.get('instance');

    return instance.get('eventInstances').filter((item) => {
      return instance.get('id') !== item.get('id');
    });
  }.property('instance.eventInstances.[]'),

  instancesToDisplay: function() {
    const allContent = this.get('eventInstances');

    if (this.get('showAll')) {
      return allContent;
    } else {
      return allContent.slice(0,3);
    }
  }.property('eventInstances.[]', 'showAll'),

  actions: {
    toggleMore() {
      this.toggleProperty('showAll');
    }
  }
});
