import Ember from 'ember';
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
const timeFormat = 'hh:mm a';
const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  startsAt: Ember.computed.alias('instance.startsAt'),
  endsAt: Ember.computed.alias('instance.endsAt'),
  subtitle: Ember.computed.alias('instance.subtitle'),
  isValid: Ember.computed.alias('instance.isValid'),

  error: function() {
    if (!this.get('isValid')) {
      return 'End Time cannot be before Start Time';
    } else {
      return null;
    }
  }.property('isValid'),

  validate: function() {
    const start = this.get('startsAt');
    const stop = this.get('endsAt');

    if (start && stop && start > stop) {
      this.set('isValid', false);
    } else {
      this.set('isValid', true);
    }
  }.observes('startsAt', 'endsAt'),

  subtitleDate: function() {
    const date = this.get('startsAt');

    if (date) {
      return date.format(`${dateFormat}, ${timeFormat}`);
    } else {
      return '';
    }
  }.property('startsAt'),

  setupFields: function() {
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
  }.on('init'),

  updateAttrs: function() {
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
  }.observes('date', 'startTime', 'endTime'),

  actions: {
    removeDate(instance) {
      this.sendAction('removeDate', instance);
    }
  }
});
