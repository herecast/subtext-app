import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  phone: DS.attr('string'),
  website: DS.attr('string'),
  hours: DS.attr('raw', {defaultValue: () => []}),
  email: DS.attr('string'),
  address: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  fullAddress: computed('address', 'city', 'state', 'zip', function(){
    const address = this.get('address');
    const city = this.get('city');
    const state = this.get('state');

    return `${address}, ${city}, ${state}`;
  }),
  coords: DS.attr(),
  service_radius: DS.attr('number'),
  milesFromUser: function(){
    //@todo inject location service
    return '(00.0 mi)';
  }.property('coords'),
  details: DS.attr('string'),
  logo: DS.attr('string'),
  images: DS.attr('raw', {defaultValue: () => [] }),
  feedback: DS.attr(),
  feedback_num: DS.attr('number'),
  has_retail_location: DS.attr('boolean'),
  views: DS.attr('number'),

  organization_id: DS.attr('number'), //To be replaced by relationship
  categories: DS.hasMany('business-category', {async: true})
});
