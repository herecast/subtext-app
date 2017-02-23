import Ember from 'ember';
import moment from 'moment';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  computed,
  get,
  isPresent,
  set
} = Ember;

export default Ember.Component.extend(TestSelector, {
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

      this.attrs.validateForm();
      return date;
    }
  }),

  actions: {
    toggleRegistration() {
      this.attrs.toggleRegistration();
    }
  }
});
