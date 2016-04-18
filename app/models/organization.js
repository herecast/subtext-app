import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  logo: DS.attr('string'),
  backgroundImage: DS.attr('string'),
  description: DS.attr('string'),
  canPublishNews: DS.attr('boolean')
});
