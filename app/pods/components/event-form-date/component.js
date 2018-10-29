import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { isPresent, isBlank } from '@ember/utils';
import { computed, observer } from '@ember/object';
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';
const timeFormat = 'hh:mm a';

export default Component.extend({
  startsAt: alias('instance.startsAt'),
  endsAt: alias('instance.endsAt'),
  subtitle: alias('instance.subtitle'),
  isValid: alias('instance.isValid'),

  init() {
    this._super(...arguments);
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
  },

  error: computed('date', 'startTime', 'endTime', function() {
    const start = this.get('startsAt');
    const stop = this.get('endsAt');

    if (isBlank(start) || isBlank(this.get('startTime'))) {
      return 'Please enter a start date and time';
    } else if (start && stop && start > stop) {
      return 'End Time cannot be before Start Time';
    }
  }),

  updateAttrs: observer('date', 'startTime', 'endTime', function() {
    let date = this.get('date');

    if (isBlank(date)) {
      // If a user clears out the date field, we reset it to the current day
      // because it should never be blank.
      this.set('date', new Date());
    } else {
      const startTime = this.get('startTime');
      const endTime = this.get('endTime');

      let startsAt = null, endsAt = null;

      date = moment(date).format(dateFormat);
      startsAt = moment(`${date} ${startTime}`, `${dateFormat} ${timeFormat}`);

      if (isPresent(endTime)) {
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
      //eslint-disable-next-line ember/closure-actions
      this.sendAction('removeDate', instance);
    }
  }
});
