import Ember from 'ember';
import moment from 'moment';

const {
  computed,
  get,
  isPresent,
  set
} = Ember;

export default Ember.Component.extend({
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

      Ember.get(this, 'validateForm')();
      return date;
    }
  }),

  actions: {
    toggleRegistration() {
      get(this, 'toggleRegistration')();
    }
  }
});
