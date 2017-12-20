import DS from 'ember-data';
import Ember from 'ember';

const { computed, get } = Ember;

export default DS.Model.extend({
  modelType: DS.attr('string'),

  carousel: DS.belongsTo({async: false}),
  feedContent: DS.belongsTo({async: false}),
  organization: DS.belongsTo({async: false}),

  isCarousel: computed.equal('modelType', 'carousel'),
  isFeedContent: computed.equal('modelType', 'feedContent'),
  isOrganization: computed.equal('modelType', 'organization'),

  viewStatus: computed.alias('feedContent.viewStatus'),

  feedItemModel: computed('modelType', function() {
    const modelType = get(this, 'modelType');

    return get(this, `${modelType}`);
  })
});
