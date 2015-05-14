import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Card'],

  timeRange: function() {
    const startTime = this.get('event.startsAt');
    const endTime = this.get('event.endsAt');

    if (startTime && endTime) {
      return `${startTime.format('LT')} - ${endTime.format('LT')}`;
    }
  }.property('startsAt', 'endsAt')
});
