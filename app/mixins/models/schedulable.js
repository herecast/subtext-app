/* global _ */
import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

const { flatten } = _;

const {
  computed,
  get,
  isPresent,
  isEmpty
} = Ember;

const {
  attr,
  hasMany
} = DS;

export default Ember.Mixin.create({
  endsAt: attr('moment-date'),
  eventUrl: attr('string'),
  registrationDeadline: attr('moment-date'),
  schedules: hasMany('schedule'),
  startsAt: attr('moment-date'),

  // @TODO: unify this
  eventInstanceId: attr('number'),
  firstInstanceId: attr('number'), //TAG:NOTE we need this for teh redirect after creating events

  otherEventInstances: hasMany('other-event-instance', {async: false}),

  // TAG:TODO move to preview component ~Nik
  eventInstances: computed('schedules.@each.{startsAt,endsAt,_remove,hasExcludedDates}', function() {
    const schedules = get(this, 'schedules').rejectBy('_remove');

    const dates = schedules.map((schedule) => {
      const scheduleStartsAt = get(schedule, 'startsAt');
      const endsAt = get(schedule, 'endsAt');
      const dates = get(schedule, 'dates');
      const overrides = get(schedule, 'overrides');

      if (dates) {
        return get(schedule, 'dates').reject((date) => {
          const momentDate = moment(date);

          if (get(schedule, 'hasExcludedDates')) {
            return overrides.any((override) => {
              return momentDate.isSame(override.date);
            });
          } else {
            return false;
          }
        }).map((date) => {
          const startsAt = moment(date);
          startsAt.hour(scheduleStartsAt.hour());
          startsAt.minute(scheduleStartsAt.minute());

          return this.store.createRecord('other-event-instance', {
            startsAt: startsAt,
            endsAt: endsAt
          });
        });
      } else {
        return [];
      }
    });

    return flatten(dates);
  }),

  futureInstances: computed('eventInstances.@each.startsAt', function() {
    const currentDate = new Date();

    return get(this, 'eventInstances').filter((inst) => {
      return get(inst, 'startsAt') > currentDate;
    });
  }),


  hasRegistrationInfo: computed.notEmpty('registrationDeadline'),

  formattedRegistrationDeadline: computed('registrationDeadline', function() { //TAG:NOTE can be deleted when dashboard is removed
    const deadline = get(this, 'registrationDeadline');

    if (deadline) {
      return moment(deadline).format('L');
    }
  }),

  timeRange: computed('startsAt', 'endsAt', function() {
    if (get(this, '_startAndEndAreValid')) {
      const startTime = get(this, 'startsAt').format('MMMM D, YYYY LT');

      if (isEmpty(get(this, 'endsAt'))) {
        return `${startTime}`;
      } else {
        const endTime = get(this, 'endsAt').format('LT');
        return `${startTime} - ${endTime}`;
      }
    }
  }),

  timeRangeNoDates: computed('startsAt', 'endsAt', function() {
    if (get(this, '_startAndEndAreValid')) {
      const startTime = get(this, 'startsAt').format('h:mm A');
      const endsAt = get(this, 'endsAt');

      if (isEmpty(endsAt)) {
        return startTime;
      } else {
        const endTime = endsAt.format('h:mm A');

        return `${startTime} ${String.fromCharCode(0x2014)} ${endTime}`;
      }
    }
  }),

  // @TODO: do we need to rollback schdedules? Can ember work with schedules instead of instances?
  rollbackSchedules() {
    get(this, 'schedules').forEach(schedule => schedule.rollbackAttributes());
  },

  save() {
    return this._super().then((savedEvent) => {
      if(!get(this, 'isDestroying')) {
        savedEvent.get('schedules').filterBy('isNew').forEach((schedule) => {
          schedule.destroyRecord();
        });
      }
    });
  },

  // PRIVATE
  _startAndEndAreValid: computed('startsAt', 'endsAt', function() {
    const start = get(this, 'startsAt');
    const stop = get(this, 'endsAt');

    if (isPresent(start) && isPresent(stop)) {
      const earlierByHour = start.hour() < stop.hour();
      const earlierByMinute = start.hour() === stop.hour() && start.minute() <= stop.minute();

      return earlierByHour || earlierByMinute;
    } else {
      return isPresent(start);
    }
  }),

});
