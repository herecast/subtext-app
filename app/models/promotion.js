import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  promotion_id: attr('number'),
  banner_id: attr('number'),
  organization_name: attr('string'),
  image_url: attr('string'),
  redirect_url: attr('string')
});
