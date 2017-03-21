import Ember from 'ember';
import DateSummary from '../date-summary/component';

const {
  get,
  inject
} = Ember;

export default DateSummary.extend({
  modals: inject.service(),
  schedule: null,
  isManaging: false,


  actions: {
    manage() {
      const schedule = get(this, 'schedule');

      get(this, 'modals').showModal('modals/event-schedule', {
        schedule:schedule,
        excludeEvent: get(this, 'excludeEvent'),
        includeEvent: get(this, 'includeEvent')
      });
    }
  }
});
