import Ember from 'ember';

const initialCount = 4;

const { get, isBlank, computed } = Ember;

export default Ember.Component.extend({
  'data-test-component': 'event-other-dates',
  showAll: false,

  eventInstances: computed('event.eventInstances.@each.startsAt', function() {
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
  }),

  hasMore: computed('eventInstances.[]', function() {
    return this.get('eventInstances.length') > initialCount;
  }),

  instancesToDisplay: computed('eventInstances.[]', 'showAll', function() {
    const allContent = this.get('eventInstances');

    if (this.get('showAll')) {
      return allContent;
    } else {
      return allContent.slice(0, initialCount);
    }
  }),

  actions: {
    toggleMore() {
      this.toggleProperty('showAll');
    }
  }
});
