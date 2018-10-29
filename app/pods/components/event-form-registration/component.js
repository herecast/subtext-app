import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { set, get, computed } from '@ember/object';
import moment from 'moment';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default Component.extend(TestSelector, {
  hasRegistrationInfo: null,

  // The date picker requires a date object, so we need to convert the deadline
  // to a date object so it can be used in the template.
  date: computed('event.registrationDeadline', {
    get() {
      let deadline = get(this, 'event.registrationDeadline');

      if (isPresent(deadline)) {
        deadline = moment(deadline);

        return deadline.toDate();
      }
    },

    set(key, date) {
      if (isPresent(date)) {
        set(this, 'event.registrationDeadline', moment(date));
      } else {
        set(this, 'event.registrationDeadline', null);
      }

      get(this, 'validateForm')();
      return date;
    }
  }),

  actions: {
    toggleRegistration() {
      get(this, 'toggleRegistration')();
    }
  }
});
