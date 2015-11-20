import DS from 'ember-data';
import Ember from 'ember';
import BaseEvent from '../mixins/models/base-event';

const {
  computed,
  get,
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

  formattedDate: function() {
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
  }.property('isValid', 'startsAt', 'endsAt'),

  startsAtHour: Ember.computed('startsAt', function() {
    if(this.get('isValid')) {
      const startsAt = get(this, 'startsAt').format('h:mmA');
      return `${startsAt}`;
    }
  }),

  endsAtHour: Ember.computed('endsAt', function() {
    if(this.get('isValid')) {
       const endsAt = get(this, 'endsAt');

       return (endsAt) ? `${endsAt.format('h:mmA')}` : null;
     }
  }),

  timeRange: function() {
    if (this.get('isValid')) {
      const startTime = this.get('startsAt').format('MMMM D, YYYY LT');

      if (Ember.isEmpty(this.get('endsAt'))) {
        return `${startTime}`;
      } else {
        const endTime = this.get('endsAt').format('LT');
        return `${startTime} - ${endTime}`;
      }
    }
  }.property('startsAt', 'endsAt'),

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

  isValid: function() {
    const start = this.get('startsAt');
    const stop = this.get('endsAt');
    const isInvalid = Ember.isBlank(start) || (Ember.isPresent(start) && Ember.isPresent(stop) && start > stop);

    return !isInvalid;
  }.property('startsAt', 'endsAt')
});
