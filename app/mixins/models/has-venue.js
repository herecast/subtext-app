import Mixin from '@ember/object/mixin';
import { get, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import DS from 'ember-data';

const { attr } = DS;

export default Mixin.create({
  venueAddress: attr('string'),
  venueCity: attr('string'),
  venueId: attr('number'),
  venueName: attr('string'),
  venueState: attr('string'),
  venueStatus: attr('string'),
  venueUrl: attr('string'),
  venueZip: attr('string'),

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
  })
});
