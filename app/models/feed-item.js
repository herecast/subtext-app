import DS from 'ember-data';
import Ember from 'ember';

const { computed, get } = Ember;

export default DS.Model.extend({
  modelType: DS.attr('string'),

  carousel: DS.belongsTo({async: false}),
  content: DS.belongsTo({async: false}),
  organization: DS.belongsTo({async: false}),

  isCarousel: computed.equal('modelType', 'carousel'),
  isContent: computed.equal('modelType', 'content'),
  isOrganization: computed.equal('modelType', 'organization'),

  viewStatus: computed.alias('content.viewStatus'),

  feedItemModel: computed('modelType', function() {
    const modelType = get(this, 'modelType');

    return get(this, `${modelType}`);
  })
});
