import DS from 'ember-data';

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
  coords: DS.attr(),
  service_radius: DS.attr('number'),
  details: DS.attr('string'),
  logo: DS.attr('string'),
  images: DS.attr('raw', {defaultValue: () => [] }),
  feedback: DS.attr(),
  feedback_num: DS.attr('number'),
  biz_type: DS.attr('string'),
  views: DS.attr('number'),

  organization_id: DS.attr('number'), //To be replaced by relationship
  categories: DS.hasMany('business-category', {async: true})
});
