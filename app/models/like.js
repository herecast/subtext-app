import DS from 'ember-data';

export default DS.Model.extend({
  casterId: DS.attr('number'),
  contentId: DS.attr('number'),
  eventInstanceId: DS.attr('number'),
  read: DS.attr('boolean', {defaultValue: false})
});
