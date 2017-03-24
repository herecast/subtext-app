import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  promotionId: attr('number'),
  imageUrl: attr('string'),
  imageHeight: attr('number'),
  imageWidth: attr('number'),
  promotionType: attr('string'),
  title: attr('string'),
  message: attr('string')
});
