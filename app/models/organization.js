import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  can_publish_news: DS.attr('boolean')
});
