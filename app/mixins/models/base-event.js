import Ember from 'ember';
import DS from 'ember-data';

const {
  computed,
  get,
  isPresent
} = Ember;

/*
 * NOTE: this mixin is used in events,
 * event-instances, and feed-content models
 */

export default Ember.Mixin.create({
  contentId: DS.attr('number'),
  // socialEnabled: DS.attr('boolean', {defaultValue: true}), //TAG:DELETED
  // extendedReachEnabled: DS.attr('boolean', {defaultValue: false}), //TAG:DELETED
  // contactEmail: DS.attr('string'), //TAG:MOVED
  // contactPhone: DS.attr('string'), //TAG:MOVED
  // content: DS.attr('string'), //TAG:MOVED
  // wantsToAdvertise: DS.attr('boolean'), //TAG:MOVED

  // comments: DS.hasMany(), //TAG:MOVED
  // commentCount: DS.attr('number'), //TAG:MOVED
  // cost: DS.attr('string'), //TAG:MOVED TAG:NORMALIZE. is used as Price in market-post model
  // imageUrl: DS.attr('string'), //TAG:MOVED
  // imageWidth: DS.attr('string'), //TAG:MOVED
  // imageHeight: DS.attr('string'), //TAG:MOVED
  // title: DS.attr('string'), //TAG:MOVED
  // subtitle: DS.attr('string'), //TAG:DELETED
  // isPaid: computed.equal('costType', 'paid'), //TAG:DELETED (unused property)
  // isFree: computed.equal('costType', 'free'), //TAG:DELETED (unused property)
  // formattedCostType //TAG:DELETED (unused computed property)
  // hasContactInfo //TAG:DELETED (unused computed property)
  // eventInstanceId // TAG:MOVED
  // startsAt: DS.attr('moment-date'), //TAG:MOVED
  // endsAt: DS.attr('moment-date'), //TAG:MOVED
  // venueAddress: DS.attr('string'), //TAG:MOVED
  // venueCity: DS.attr('string'), //TAG:MOVED
  // venueName: DS.attr('string'), //TAG:MOVED
  // venueState: DS.attr('string'), //TAG:MOVED
  // venueZip: DS.attr('string'), //TAG:MOVED
  // costType: DS.attr('string'), //TAG:MOVED
  // venueId: DS.attr('number'), //TAG:MOVED
  // venueStatus: DS.attr('string'), //TAG:MOVED
  // venueUrl: DS.attr('string'), //TAG:MOVED
  // registrationDeadline: DS.attr('moment-date'), //TAG:MOVED
  // hasRegistrationInfo: computed.notEmpty('registrationDeadline'), //TAG:MOVED
  // eventUrl: DS.attr('string'), //TAG:MOVED
  // formattedRegistrationDeadline, computed //TAG:MOVED

  fullAddress: computed('venueAddress', 'venueCity', 'venueState', function() {
    let addr = get(this, 'venueAddress');
    let city = get(this, 'venueCity');
    const state = get(this, 'venueState');

    if (isPresent(addr) && isPresent(city) && isPresent(state)) {
      addr = addr.split(' ').join('+');
      city = city.split(' ').join('+');

      return `${addr},${city},${state}`;
    } else {
      return '';
    }
  }),

  directionsUrl: computed('fullAddress', function() {
    const url = `maps.google.com/maps?daddr=${this.get('fullAddress')}`;
    const platform = ((typeof navigator !== 'undefined') ? navigator.platform : null);
    const isios = (platform  && (
      (platform.indexOf("iPhone") !== -1) ||
      (platform.indexOf("iPod") !== -1) ||
      (platform.indexOf("iPad") !== -1)
    ));

    if (isios) {
      return `maps://${url}`;
    } else {
      return `https://${url}`;
    }
  }),

  futureInstances: computed('eventInstances.@each.startsAt', function() {
    const currentDate = new Date();

    return get(this, 'eventInstances').filter((inst) => {
      return get(inst, 'startsAt') > currentDate;
    });
  })
});
