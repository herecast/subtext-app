import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const initialCount = 4;

const { get, isBlank, computed } = Ember;

export default Ember.Component.extend(TestSelector, {
  'data-test-component': 'event-other-dates',
  showAll: false,
  instanceRoute: 'feed.show-instance',

  eventInstances: computed('event.futureInstances.@each.startsAt', function() {
    const event = this.get('event');

    if (event) {
      // Since this component is shared between the event show page and
      // event preview, the startsAt is only present on an event for the
      // show page.
      let startsAt = get(event, 'startsAt');

      if (get(event, 'isNew') || isBlank(startsAt)) {
        startsAt = get(event, 'eventInstances.firstObject.startsAt');
      }

      return get(event, 'futureInstances').sort((a,b) => {
        return get(a, 'startsAt') - get(b, 'startsAt');
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
