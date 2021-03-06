import { isBlank, isEmpty } from '@ember/utils';
import { get, computed } from '@ember/object';
import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  endsAt: DS.attr('moment-date'),
  startsAt: DS.attr('moment-date', {defaultValue: () => { return moment(); }}),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),

  formattedDate: computed('startsAt', 'endsAt', function() {
    const startsAt = get(this, 'startsAt');
    if (isBlank(startsAt)) {
      return '';
    }

    const date = startsAt.format('MMM D');
    const startTime = startsAt.format('h:mmA');

    if (isEmpty(this.get('endsAt'))) {
      return `${date} | ${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('h:mmA');

      return `${date} | ${startTime}-${endTime}`;
    }
  }),

  formattedHours: computed('startsAt', 'endsAt', function() {
    const startTime = this.get('startsAt').format('LT');

    if (isEmpty(this.get('endsAt'))) {
      return `${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('LT');
      return `${startTime} - ${endTime}`;
    }
  }),

  timeRange: computed('startsAt', 'endsAt', function() {
    const startTime = this.get('startsAt').format('MMMM D, YYYY LT');

    if (isEmpty(this.get('endsAt'))) {
      return `${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('LT');
      return `${startTime} - ${endTime}`;
    }
  })
});
