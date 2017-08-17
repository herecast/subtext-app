import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-EventDates',
  classNameBindings: ['hasOtherInstances:has-additional-dates'],

  showOtherDates: false,
  otherInstances: [],

  hasOtherInstances: computed.gt('otherInstances.length', 1),

  actions: {
    toggleShowOtherDates() {
      this.toggleProperty('showOtherDates');
    }
  }
});
