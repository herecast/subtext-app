import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;

export default DS.Model.extend({
  modelType: DS.attr('string'),

  carousel: DS.belongsTo(),
  feedContent: DS.belongsTo(),
  organization: DS.belongsTo(),

  isCarousel: computed.equal('modelType', 'carousel'),
  isFeedContent: computed.equal('modelType', 'feedContent'),
  isOrganization: computed.equal('modelType', 'organization')
});
