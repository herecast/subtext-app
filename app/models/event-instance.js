import DS from 'ember-data';
import Ember from 'ember';
import BaseEvent from '../mixins/models/base-event';

const {
  computed,
  get,
  isPresent,
  isEmpty
} = Ember;

export default DS.Model.extend(BaseEvent, {
  // Only returned by the API if the current user is an admin
  adminContentUrl: DS.attr('string'),

  canEdit: DS.attr('boolean'),
  commentCount: DS.attr('number'),
  contentId: DS.attr('number'),
  eventId: DS.attr('number'),
  eventInstances: DS.hasMany('other-event-instance'),
  presenterName: DS.attr('string'),
  venueLatitude: DS.attr('string'),
  venueLongitude: DS.attr('string'),
  venueLocateName: DS.attr('string'),
  publishedAt: DS.attr('moment-date'),
  updatedAt: DS.attr('moment-date'),

  formattedDate: computed('isValid', 'startsAt', 'endsAt', function() {
    if (this.get('isValid')) {
      const date = this.get('startsAt').format('MMM D');
      const startTime = this.get('startsAt').format('h:mmA');

      if (Ember.isEmpty(this.get('endsAt'))) {
        return `${date} | ${startTime}`;
      } else {
        const endTime = this.get('endsAt').format('h:mmA');

        return `${date} | ${startTime}-${endTime}`;
      }
    }
  }),

  startsAtHour: Ember.computed('startsAt', function() {
    if(get(this, 'isValid')) {
      return get(this, 'startsAt').format('h:mmA');
    }
  }),

  endsAtHour: Ember.computed('endsAt', function() {
    if(get(this, 'isValid')) {
       const endsAt = get(this, 'endsAt');

       return (endsAt) ? `${endsAt.format('h:mmA')}` : null;
     }
  }),

  timeRange: computed('startsAt', 'endsAt', function() {
    if (this.get('isValid')) {
      const startTime = this.get('startsAt').format('MMMM D, YYYY LT');

      if (Ember.isEmpty(this.get('endsAt'))) {
        return `${startTime}`;
      } else {
        const endTime = this.get('endsAt').format('LT');
        return `${startTime} - ${endTime}`;
      }
    }
  }),

  timeRangeNoDates: computed('startsAt', 'endsAt', function() {
    const startTime = get(this, 'startsAt').format('h:mmA');
    const endsAt = get(this, 'endsAt');

    if (isEmpty(endsAt)) {
      return startTime;
    } else {
      const endTime = endsAt.format('h:mmA');

      return `${startTime}-${endTime}`;
    }
  }),

  isValid: computed('startsAt', 'endsAt', function() {
    const start = get(this, 'startsAt');
    const stop = get(this, 'endsAt');

    if (isPresent(start) && isPresent(stop)) {
      const earlierByHour = start.hour() < stop.hour();
      const earlierByMinute = start.hour() === stop.hour() && start.minute() <= stop.minute();

      return earlierByHour || earlierByMinute;
    } else {
      return isPresent(start);
    }
  })
});
