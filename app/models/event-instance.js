import DS from 'ember-data';
import moment from 'moment';
import Ember from 'ember';
import BaseEvent from '../mixins/models/base-event';

export default DS.Model.extend(BaseEvent, {
  canEdit: DS.attr('boolean'),
  eventId: DS.attr('number'),
  eventInstances: DS.hasMany('event-instance'),

  spansDays: function() {
    const start = this.get('startsAt');
    const end = this.get('endsAt');

    return moment().diff(start, end) > 0;
  }.property('startsAt', 'endsAt'),

  timeRange: function() {
    const startTime = this.get('startsAt').format('MMMM, Do, YYYY LT');

    if (Ember.isEmpty(this.get('endsAt'))) {
      return `${startTime}`;
    } else {
      const endTime = this.get('endsAt').format('LT');
      return `${startTime} - ${endTime}`;
    }
  }.property('startsAt', 'endsAt'),

  longTimeRange: function() {
    const start = this.get('startsAt').format('dddd, MMMM Do LT');
    let endFormat = 'LT';

    if (this.get('spansDays')) {
      endFormat = 'dddd, MMMM Do LT';
    }

    const end = this.get('endsAt').format(endFormat);

    return `${start} to ${end}`;
  }.property('startsAt', 'endsAt')

});
