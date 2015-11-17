import Ember from 'ember';

const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  isPreview: false,
  title: Ember.computed.oneWay('event.title'),
  venueName: Ember.computed.oneWay('event.venueName'),
  venueCity: Ember.computed.oneWay('event.venueCity'),
  venueState: Ember.computed.oneWay('event.venueState'),
  mixpanel: Ember.inject.service('mixpanel'),

  timeRange: Ember.computed.oneWay('event.formattedDate'),

  hasVenue: Ember.computed.notEmpty('venue'),

  venue: function() {
    const name = this.get('venueName');
    const city = this.get('venueCity');
    const state = this.get('venueState');

    if (isPresent(name)) {
      return name;
    } else {
      return [city, state].join(', ');
    }
  }.property('venueName', 'venueCity', 'venueState'),

  eventId: function() {
    if (Ember.isPresent(this.get('event.eventInstanceId'))) {
      return this.get('event.eventInstanceId');
    } else {
      return this.get('event.id');
    }
  }.property('event.id', 'event.eventInstanceId'),

  actions: {
    trackSimilarContentClick(){
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, 
         mixpanel.getNavigationProperties('Event', 'Event Card', 1));
      Ember.merge(props, mixpanel.getContentProperties(this.get('event')));
      Ember.merge(props, {'sourceContentId': this.get('sourceContentId')});
      mixpanel.trackEvent('selectSimilarContent', props);
    }
  }
});
