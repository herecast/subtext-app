import Ember from 'ember';
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
const timeFormat = 'hh:mm a';
const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  startsAt: Ember.computed.alias('instance.startsAt'),
  endsAt: Ember.computed.alias('instance.endsAt'),
  subtitle: Ember.computed.alias('instance.subtitle'),

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
  }.on('didInsertElement'),

  updateAttrs: function() {
    const date = moment(this.get('date')).format(dateFormat);
    const startTime = this.get('startTime');
    const endTime = this.get('endTime');
    let startsAt = null, endsAt = null;

    if (Ember.isPresent(startTime)) {
      startsAt = moment(`${date} ${startTime}`, `${dateFormat} ${timeFormat}`);
    }

    if (Ember.isPresent(endTime)) {
      endsAt = moment(`${date} ${endTime}`, `${dateFormat} ${timeFormat}`);
    }

    this.setProperties({
      startsAt: startsAt,
      endsAt: endsAt
    });
  }.observes('date', 'startTime', 'endTime'),

  actions: {
    removeDate(instance) {
      this.sendAction('removeDate', instance);
    }
  }
});
