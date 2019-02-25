import DS from 'ember-data';

export default DS.Model.extend({
  organizationName: DS.attr('string'),
  organizationProfileImageUrl: DS.attr('string'),
  organizationId: DS.attr('number'),
  contentId: DS.attr('number'),
  flagType: DS.attr('string')
});
