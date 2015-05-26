import DS from 'ember-data';
import Ember from 'ember';
import BaseEvent from '../mixins/models/base-event';

export default DS.Model.extend(BaseEvent, {
  // Only returned by the API if the current user is an admin
  adminContentUrl: DS.attr('string'),

  canEdit: DS.attr('boolean'),
  eventId: DS.attr('number'),
  eventInstances: DS.hasMany('event-instance'),
  venueLatitude: DS.attr('string'),
  venueLongitude: DS.attr('string'),
  venueLocateName: DS.attr('string'),

  formattedDate: function() {
    return this.get('startsAt').format('MMMM D, YYYY');
  }.property('startsAt'),

  formattedHours: function() {
    const startTime = this.get('startsAt').format('LT');

    if (Ember.isEmpty(this.get('endsAt'))) {
      return `${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('LT');
      return `${startTime} - ${endTime}`;
    }
  }.property('startsAt', 'endsAt'),

  timeRange: function() {
    const startTime = this.get('startsAt').format('MMMM D, YYYY LT');

    if (Ember.isEmpty(this.get('endsAt'))) {
      return `${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('LT');
      return `${startTime} - ${endTime}`;
    }
  }.property('startsAt', 'endsAt')
});
