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
  value: null,
  date: computed('value', {
    get() {
      let deadline = get(this, 'value');

      if (isPresent(deadline)) {
        deadline = moment(deadline);

        return deadline.toDate();
      }
    },

    set(key, date) {
      if (isPresent(date)) {
        set(this, 'value', moment(date));
      } else {
        set(this, 'value', null);
      }

      if(get(this, 'update')) {
        get(this, 'update')(moment(date));
      }

      return date;
    }
  }),

  actions: {
    toggleRegistration() {
      if(get(this, 'registrationEnabled')) {
        set(this, 'date', null);
      }

      this.toggleProperty('registrationEnabled');
    }
  }
});
