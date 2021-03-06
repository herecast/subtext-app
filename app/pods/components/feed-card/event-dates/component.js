import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  classNames: 'FeedCard-EventDates',
  classNameBindings: ['hasOtherInstances:has-additional-dates', 'model.hasExpired:expired'],

  model: null,
  eventDate: null,
  showOtherDates: false,

  futureInstances: A(),

  sortedInstances: computed('futureInstances.@each.startAt', function() {
    return get(this, 'futureInstances').sort((a,b) => {
      return get(a, 'startsAt') - get(b, 'startsAt');
    });
  }),

  hasOtherInstances: computed('futureInstances.length', 'eventDate', function() {
    const numberOfFutureInstances = get(this, 'futureInstances.length');
    const hasNoFutureInstances = numberOfFutureInstances === 0;
    const firstFutureStartsAt = get(this, 'futureInstances.firstObject.startsAt');
    const onlyInstanceIsSameAsModel = numberOfFutureInstances === 1 && firstFutureStartsAt.isSame(get(this, 'model.startsAt'));

    if (hasNoFutureInstances || onlyInstanceIsSameAsModel) {
      return false;
    }

    return  numberOfFutureInstances > 0;
  }),

  actions: {
    toggleShowOtherDates() {
      this.toggleProperty('showOtherDates');
    }
  }
});
