import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import DateSummary from '../date-summary/component';

export default DateSummary.extend({
  modals: service(),
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
