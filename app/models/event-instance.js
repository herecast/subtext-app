import DS from 'ember-data';
import BaseEvent from '../mixins/models/base-event';

export default DS.Model.extend(BaseEvent, {
  canEdit: DS.attr('boolean'),
  eventInstances: DS.hasMany('event-instance'),

  timeRange: function() {
    const startTime = this.get('startsAt').format('MMMM, Do, YYYY, LT');
    const endTime = this.get('endsAt').format('LT');

    return `${startTime} - ${endTime}`;
  }.property('startsAt', 'endsAt'),

  timeRangeTimeOnly: function() {
    const startTime = this.get('startsAt').format('LT');
    const endTime = this.get('endsAt').format('LT');

    return `${startTime} - ${endTime}`;
  }.property('startsAt', 'endsAt'),
});
