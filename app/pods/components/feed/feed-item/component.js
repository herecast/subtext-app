import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  model: null,
  showingDetailInFeed: null,
  organization: null,
  canManage: false,
  displayAsPublic: false,

  isFeedContent: computed.alias('model.isFeedContent'),
  isCarousel: computed.alias('model.isCarousel'),
  isOrganization: computed.alias('model.isOrganization'),

  itemModel: computed('model.modelType', function() {
    const modelType = get(this, 'model.modelType');

    return get(this, `model.${modelType}`);
  })
});
