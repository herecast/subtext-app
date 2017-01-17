import Ember from 'ember';
import DS from 'ember-data';

const { attr } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  cat_id:   computed.alias('id'),
  name:     attr('string'),
  query:    attr('string'),
  img:      attr('string'),
  banner:   attr('string'),
  count:    attr('number'),
  featured: attr('boolean', { defaultValue: false }),
  trending: attr('boolean', { defaultValue: false }),
  query_modifier: attr('string')
});
