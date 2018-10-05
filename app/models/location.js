import Ember from 'ember';
import DS from 'ember-data';

const { get, computed } = Ember;

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
