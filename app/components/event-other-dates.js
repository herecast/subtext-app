import Ember from 'ember';

const initialCount = 4;

const { get, isBlank } = Ember;

export default Ember.Component.extend({
  showAll: false,

  eventInstances: function() {
    const event = this.get('event');

    if (event) {
      // Since this component is shared between the event show page and
      // event preview, the startsAt is only present on an event for the
      // show page.
      let startsAt = get(event, 'startsAt');

      if (event.get('isNew') || isBlank(startsAt)) {
        startsAt = event.get('eventInstances.firstObject.startsAt');
      }

      return event.get('eventInstances').filter((instance) => {
        return instance.get('startsAt').isAfter(startsAt);
      });
    } else {
      return [];
    }
  }.property('event.eventInstances.@each.startsAt'),

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
