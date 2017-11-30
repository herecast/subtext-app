import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-EventDates',
  classNameBindings: ['hasOtherInstances:has-additional-dates'],

  showOtherDates: false,
  otherInstances: [],

  sortedInstances: computed('otherInstances.@each.startAt', function() {
    return get(this, 'otherInstances').sort((a,b) => {
      return get(a, 'startsAt') - get(b, 'startsAt');
    });
  }),

  hasOtherInstances: computed.gt('otherInstances.length', 1),

  actions: {
    toggleShowOtherDates() {
      this.toggleProperty('showOtherDates');
    }
  }
});
