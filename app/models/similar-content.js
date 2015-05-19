import DS from 'ember-data';

export default DS.Model.extend({
  author: DS.attr('string'),
  contentUrl: DS.attr('string'),
  eventInstanceId: DS.attr('number'),
  snippet: DS.attr('string'),
  title: DS.attr('string')
});
