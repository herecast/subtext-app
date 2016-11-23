import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  name:     attr('string'),
  query:    attr('string'),
  img:      attr('string'),
  banner:   attr('string'),
  count:    attr('number'),
  featured: attr('boolean', { defaultValue: false }),
  trending: attr('boolean', { defaultValue: false })
});
