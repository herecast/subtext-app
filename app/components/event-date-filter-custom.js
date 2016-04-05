import Ember from 'ember';
import moment from 'moment';

const { observer, computed, on } = Ember;

export default Ember.Component.extend({
  classNames: ['popover', 'bottom', 'in', 'EventFilter-calendar'],

  startDateLabel: computed('customStartDate', function() {
    const startDate = moment(this.get('customStartDate'));
    return startDate.format('L');
  }),

  updateMinEndDate: observer('customStartDate', function() {
    const startDate = this.get('customStartDate');
    const pikaday = this.get('endInput');

    if (startDate && pikaday) {
      pikaday.setMinDate(startDate);
      pikaday.gotoDate(startDate);
    }
  }),

  endDateLabel: computed('customEndDate', function() {
    const endDate = moment(this.get('customEndDate'));
    return endDate.format('L');
  }),

  setupCalendars: on('didInsertElement', function() {
    new Pikaday({
      field: this.$('#custom-start-date input')[0],
      firstDay: 0,
      minDate: new Date(),
      maxDate: new Date('2020-12-31'),
      yearRange: [2015, 2020],
      bound: false,
      container: this.$('#custom-start-date .calendar')[0],
      defaultDate: this.get('customStartDate'),
      setDefaultDate: true,
      onSelect: (value) => {
        this.set('customStartDate', value);
      }
    });

    const endInput = new Pikaday({
      field: this.$('#custom-end-date input')[0],
      firstDay: 0,
      minDate: new Date(),
      maxDate: new Date('2020-12-31'),
      yearRange: [2015, 2020],
      bound: false,
      container: this.$('#custom-end-date .calendar')[0],
      defaultDate: this.get('customEndDate'),
      setDefaultDate: true,
      onSelect: (value) => {
        Ember.run(() => {
          this.set('customEndDate', value);
        });

        this.sendAction('afterSelect');
      }
    });

    this.set('endInput', endInput);
  }),

  actions: {
    closeCalendar() {
      this.sendAction('closeCalendar');
    }
  }
});
