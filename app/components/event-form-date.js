import Ember from 'ember';
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
const timeFormat = 'HH:mm A';
const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  startsAt: Ember.computed.alias('instance.startsAt'),
  endsAt: Ember.computed.alias('instance.endsAt'),
  subtitle: Ember.computed.alias('instance.subtitle'),

  setupFields: function() {
    let date, startsAt, endsAt, startTime, endTime;

    if (isPresent(this.get('startsAt'))) {
      startsAt = moment(this.get('startsAt'));
      startTime = startsAt.format(timeFormat);
      date = startsAt.format(dateFormat);
    }

    if (isPresent(this.get('endsAt'))) {
      endsAt = moment(this.get('endsAt')).format(timeFormat);
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

    const startsAt = moment(`${date} ${startTime}`, `${dateFormat} ${timeFormat}`);
    const endsAt = moment(`${date} ${endTime}`, `${dateFormat} ${timeFormat}`);

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
