import DS from 'ember-data';

export default DS.Model.extend({
  content: DS.attr('string'),
  eventInstanceId: DS.attr('number'),
  parentCommentId: DS.attr('number')
});
