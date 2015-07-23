import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['popover', 'bottom', 'in', 'EventFilter-calendar'],

  startDateLabel: function() {
    const startDate = moment(this.get('customStartDate'));
    return startDate.format('L');
  }.property('customStartDate'),

  updateMinEndDate: function() {
    const startDate = this.get('customStartDate');
    const pikaday = this.get('endInput');

    if (startDate && pikaday) {
      pikaday.setMinDate(startDate);
    }
  }.observes('customStartDate'),

  endDateLabel: function() {
    const endDate = moment(this.get('customEndDate'));
    return endDate.format('L');
  }.property('customEndDate'),

  setupCalendars: function() {
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
  }.on('didInsertElement'),

  actions: {
    closeCalendar() {
      this.sendAction('closeCalendar');
    }
  }
});
