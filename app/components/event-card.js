import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Card'],

  timeRange: function() {
    const startTime = this.get('event.startsAt').format('LT');
    const endTime = this.get('event.endsAt').format('LT');

    return `${startTime} - ${endTime}`;
  }.property('startsAt', 'endsAt'),
});
