import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['Card'],

  timeRange: function() {
    const startTime = moment(this.get('event.startsAt')).format('LT');
    const endTime = moment(this.get('event.endsAt')).format('LT');

    return `${startTime} - ${endTime}`;
  }.property('event.{startsAt,endsAt}')
});
