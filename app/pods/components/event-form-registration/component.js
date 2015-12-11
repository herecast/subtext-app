import Ember from 'ember';
import moment from 'moment';

const {
  get,
  isPresent,
  observer,
  set
} = Ember;

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.resetProperties();
    this.convertMomentToDate();
  },

  resetProperties() {
    const hasRegistrationInfo = get(this, 'event.hasRegistrationInfo');

    set(this, 'registrationEnabled', hasRegistrationInfo);
  },

  // The date picker requires a date object, so we need to convert the deadline
  // to a date object so it can be used in the template.
  convertMomentToDate: function() {
    let deadline = get(this, 'event.registrationDeadline');

    if (isPresent(deadline)) {
      deadline = moment(deadline);

      set(this, 'date', deadline.toDate());
    }
  },

  updateDeadline: observer('date', function() {
    const date = get(this, 'date');

    if (isPresent(date)) {
      set(this, 'event.registrationDeadline', moment(date));
    } else {
      set(this, 'event.registrationDeadline', null);
    }
  }),

  actions: {
    toggleRegistration() {
      this.attrs.toggleRegistration();
      this.toggleProperty('registrationEnabled');
    }
  }
});
