/* global _ */
import { alias, empty } from '@ember/object/computed';

import Mixin from '@ember/object/mixin';
import { get, computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';

const { flatten } = _;

const {
  attr,
  hasMany
} = DS;

export default Mixin.create({
  //NOTE: this is for the content model and not the event-instance model
  eventUrl: attr('string'),
  schedules: hasMany('schedule'),

  //TAG:NOTE we need this for the redirect after creating events
  eventInstanceId: attr('number'),

  otherEventInstances: hasMany('other-event-instance', {async: false}),

  // TAG:TODO move to preview component ~Nik
  scheduleInstances: computed('schedules.@each.{startsAt,endsAt,_remove,hasExcludedDates}', function() {
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

  // Switches to getting these from schedule if this event is being edited.
  eventInstances: computed('scheduleInstances.[]', 'hasDirtyAttributes', 'otherEventInstances.[]', function() {
    const hasDirtyAttributes = get(this, 'hasDirtyAttributes');

    return hasDirtyAttributes ? get(this, 'scheduleInstances') : get(this, 'otherEventInstances');
  }),

  futureInstances: computed('eventInstances.@each.{startsAt,endsAt}', function() {
    const currentDate = new Date();

    return get(this, 'eventInstances').filter((inst) => {
      let timeToCompare = get(inst, 'endsAt') ? get(inst, 'endsAt') : get(inst, 'startsAt');

      return timeToCompare > currentDate;
    });
  }),

  defaultInstance: computed('futureInstances.[]', function() {
    if (get(this, 'futureInstances.length')) {
      return get(this, 'futureInstances.firstObject');
    } else {
      return get(this, 'otherEventInstances.lastObject');
    }
  }),

  startsAt: alias('defaultInstance.startsAt'),
  endsAt: alias('defaultInstance.endsAt'),

  hasExpired: empty('futureInstances'),

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
    return this._super().then(() => {
      if(!get(this, 'isDestroying')) {
        this.get('schedules').filterBy('isNew').forEach((schedule) => {
          schedule.destroyRecord();
        });
      }
      return this;
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
