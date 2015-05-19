import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

export default Ember.Mixin.create({
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  content: DS.attr('string'),
  cost: DS.attr('string'),
  costType: DS.attr('string', {defaultValue: 'free'}),
  endsAt: DS.attr('moment-date', {defaultValue: moment()}),
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

  bannerUrl: function() {
    if (!Ember.isEmpty(this.get('imageUrl'))) {
      return this.get('imageUrl');
    } else {
      return 'http://placehold.it/800x600';
    }
  }.property('imageUrl'),

  formattedCostType: function() {
    const costType = this.get('costType');
    if (!Ember.isEmpty(costType)) {
      return costType.charAt(0).toUpperCase() + costType.slice(1);
    }
  }.property('costType')
});
  
