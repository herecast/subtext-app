import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  icon_class: DS.attr('string'),

  // we have to do this because the ember data unsets
  // the original parent_id property while parsing
  // the hasMany relationship
  original_parent_ids: DS.attr(),
  parent_ids: computed.alias('original_parent_ids'),

  original_child_ids: DS.attr(),
  child_ids: computed.alias('original_child_ids'),

  parents: DS.hasMany('business-category', {async: true, inverse: 'child_categories'}),
  child_categories: DS.hasMany('business-category', {async: true, inverse: 'parents'})
});
