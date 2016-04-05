import Ember from 'ember';
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
const timeFormat = 'hh:mm a';
const {
  isPresent,
  observer,
  computed,
  on
} = Ember;

export default Ember.Component.extend({
  startsAt: Ember.computed.alias('instance.startsAt'),
  endsAt: Ember.computed.alias('instance.endsAt'),
  subtitle: Ember.computed.alias('instance.subtitle'),
  isValid: Ember.computed.alias('instance.isValid'),

  error: computed('date', 'startTime', 'endTime', function() {
    const start = this.get('startsAt');
    const stop = this.get('endsAt');

    if (Ember.isBlank(start) || Ember.isBlank(this.get('startTime'))) {
      return 'Please enter a start date and time';
    } else if (start && stop && start > stop) {
      return 'End Time cannot be before Start Time';
    }
  }),

  setupFields: on('init', function() {
    let date, startsAt, startTime, endTime;

    if (isPresent(this.get('startsAt'))) {
      startsAt = moment(this.get('startsAt'));
      startTime = startsAt.format(timeFormat);
      date = startsAt.toDate();
    }

    if (isPresent(this.get('endsAt'))) {
      endTime = moment(this.get('endsAt')).format(timeFormat);
    }

    this.setProperties({
      date: date,
      startTime: startTime,
      endTime: endTime
    });
  }),

  updateAttrs: observer('date', 'startTime', 'endTime', function() {
    let date = this.get('date');

    if (Ember.isBlank(date)) {
      // If a user clears out the date field, we reset it to the current day
      // because it should never be blank.
      this.set('date', new Date());
    } else {
      const startTime = this.get('startTime');
      const endTime = this.get('endTime');

      let startsAt = null, endsAt = null;

      date = moment(date).format(dateFormat);
      startsAt = moment(`${date} ${startTime}`, `${dateFormat} ${timeFormat}`);

      if (Ember.isPresent(endTime)) {
        endsAt = moment(`${date} ${endTime}`, `${dateFormat} ${timeFormat}`);
      }

      this.setProperties({
        startsAt: startsAt,
        endsAt: endsAt
      });
    }
  }),

  actions: {
    removeDate(instance) {
      this.sendAction('removeDate', instance);
    }
  }
});
