import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  phone: DS.attr('string'),
  website: DS.attr('string'),
  hours: DS.attr('string'),
  email: DS.attr('string'),
  address: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  lat: DS.attr('number'),
  lng: DS.attr('number'),
  service_radius: DS.attr('number'),
  logo: DS.attr('string'),
  images: DS.attr(),
  feedback: DS.attr(),

  organization_id: DS.attr('number'), //To be replaced by relationship
  categories: DS.hasMany('business-category', {async: true})
});
