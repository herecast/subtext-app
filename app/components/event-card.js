import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Card'],
  isPreview: false,

  title: Ember.computed.oneWay('event.title'),
  content: Ember.computed.oneWay('event.content'),
  venueName: Ember.computed.oneWay('event.venueName'),
  venueAddress: Ember.computed.oneWay('event.venueAddress'),
  venueCity: Ember.computed.oneWay('event.venueCity'),
  venueState: Ember.computed.oneWay('event.venueState'),
  venueZipcode: Ember.computed.oneWay('event.venueZipcode'),

  timeRange: function() {
    const startTime = this.get('event.startsAt');
    const endTime = this.get('event.endsAt');

    if (startTime && endTime) {
      return `${startTime.format('LT')} - ${endTime.format('LT')}`;
    }
  }.property('startsAt', 'endsAt')
});
