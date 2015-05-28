import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

export default Ember.Mixin.create({
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  content: DS.attr('string'),
  cost: DS.attr('string'),
  costType: DS.attr('string', {defaultValue: 'free'}),
  endsAt: DS.attr('moment-date'),
  eventUrl: DS.attr('string'),
  extendedReachEnabled: DS.attr('boolean', {defaultValue: true}),
  imageUrl: DS.attr('string'),
  socialEnabled: DS.attr('boolean', {defaultValue: true}),
  startsAt: DS.attr('moment-date', {defaultValue: moment()}),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),
  venueAddress: DS.attr('string'),
  venueCity: DS.attr('string'),
  venueId: DS.attr('number'),
  venueName: DS.attr('string'),
  venueState: DS.attr('string'),
  venueUrl: DS.attr('string'),
  venueZipcode: DS.attr('string'),

  safeImageUrl: function() {
    if (Ember.isPresent(this.get('imageUrl'))) {
      return this.get('imageUrl');
    } else {
      return 'http://placehold.it/800x600&text=+';
    }
  }.property('imageUrl'),

  formattedCostType: function() {
    const costType = this.get('costType');
    if (Ember.isPresent(costType)) {
      return costType.charAt(0).toUpperCase() + costType.slice(1);
    }
  }.property('costType'),

  hasLocationInfo: function() {
    return Ember.isPresent(this.get('venueAddress')) || Ember.isPresent(this.get('venueCity')) || 
      Ember.isPresent(this.get('venueName')) || Ember.isPresent(this.get('venueState')) || 
      Ember.isPresent(this.get('venueZipcode'));
  }.property('venueAddress', 'venueCity', 'venueState', 'venueZipcode', 'venueName'),

  hasContactInfo: function() {
    return Ember.isPresent(this.get('contactEmail')) || Ember.isPresent(this.get('contactPhone')) || 
      Ember.isPresent(this.get('eventUrl'));
  }.property('contactEmail', 'contactPhone', 'eventUrl'),

  directionsUrl: function() {
    let addr = this.get('venueAddress');
    let city = this.get('venueCity');
    const state = this.get('venueState');

    if (Ember.isPresent(addr) && Ember.isPresent(city) && Ember.isPresent(state)) {
      addr = addr.split(' ').join('+');
      city = city.split(' ').join('+');

      return `https://www.google.com/maps/dir//${addr},${city},${state}`;
    } else {
      return 'https://www.google.com/maps/dir///';
    }
  }.property('venueAddress', 'venueCity', 'venueState')
});
