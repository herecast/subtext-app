import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  promotion_id: attr('number'),
  image_url: attr('string'),
  promotion_type: attr('string'),
  title: attr('string'),
  message: attr('string')
});
