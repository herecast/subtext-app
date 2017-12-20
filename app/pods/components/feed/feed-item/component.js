import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  model: null,
  showingDetailInFeed: null,
  organization: null,
  canManage: false,
  displayAsPublic: false,
  hideComments: false,

  isFeedContent: computed.alias('model.isFeedContent'),
  isCarousel: computed.alias('model.isCarousel'),
  isOrganization: computed.alias('model.isOrganization'),

  feedItemModel: computed.alias('model.feedItemModel')
});
