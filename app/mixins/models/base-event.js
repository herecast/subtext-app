import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const {
  computed,
  get
} = Ember;

export default Ember.Mixin.create({
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  cost: DS.attr('string'),
  costType: DS.attr('string'),
  endsAt: DS.attr('moment-date'),
  eventUrl: DS.attr('string'),
  eventInstanceId: DS.attr('number'),
  extendedReachEnabled: DS.attr('boolean', {defaultValue: false}),
  imageUrl: DS.attr('string'),
  registrationDeadline: DS.attr('moment-date'),
  socialEnabled: DS.attr('boolean', {defaultValue: true}),
  startsAt: DS.attr('moment-date'),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),
  venueAddress: DS.attr('string'),
  venueCity: DS.attr('string'),
  venueId: DS.attr('number'),
  venueName: DS.attr('string'),
  venueState: DS.attr('string'),
  venueStatus: DS.attr('string'),
  venueUrl: DS.attr('string'),
  venueZip: DS.attr('string'),

  isPaid: Ember.computed.equal('costType', 'paid'),

  safeImageUrl: computed('imageUrl', function() {
    if (Ember.isPresent(this.get('imageUrl'))) {
      return this.get('imageUrl');
    } else {
      return '//placehold.it/800x600&text=+';
    }
  }),

  formattedCostType: computed('costType', function() {
    const costType = this.get('costType');
    if (Ember.isPresent(costType)) {
      return costType.charAt(0).toUpperCase() + costType.slice(1);
    }
  }),

  formattedRegistrationDeadline: computed('registrationDeadline', function() {
    const deadline = get(this, 'registrationDeadline');

    if (deadline) {
      return moment(deadline).format('L');
    }
  }),

  hasLocationInfo: computed('venueAddress', 'venueCity', 'venueState', 'venueZip', 'venueName', function() {
    return Ember.isPresent(this.get('venueAddress')) || Ember.isPresent(this.get('venueCity')) ||
      Ember.isPresent(this.get('venueName')) || Ember.isPresent(this.get('venueState')) ||
      Ember.isPresent(this.get('venueZip'));
  }),

  hasContactInfo: computed('contactEmail', 'contactPhone', 'eventUrl', function() {
    return Ember.isPresent(this.get('contactEmail')) || Ember.isPresent(this.get('contactPhone')) ||
      Ember.isPresent(this.get('eventUrl'));
  }),

  hasRegistrationInfo: computed.notEmpty('registrationDeadline'),

  fullAddress: computed('venueAddress', 'venueCity', 'venueState', function() {
    let addr = this.get('venueAddress');
    let city = this.get('venueCity');
    const state = this.get('venueState');

    if (Ember.isPresent(addr) && Ember.isPresent(city) && Ember.isPresent(state)) {
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
  })
});
