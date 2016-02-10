import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),

  parents: DS.hasMany('business-category', {async: true, inverse: 'child_categories'}),
  child_categories: DS.hasMany('business-category', {async: true, inverse: 'parents'})
});
