import { computed, get } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  city: DS.attr('string'),
  state: DS.attr('string'),
  zipcode: DS.attr('string'),
  latitude: DS.attr('string'),
  longitude: DS.attr('string'),

  name: computed('city', 'state', function() {
    return [get(this, 'city'), get(this, 'state')].join(', ');
  })
});
