import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  model: null,
  showingDetailInFeed: null,
  organization: null,
  canManage: false,
  canEditIfAllowed: false,
  displayAsPublic: false,
  hideComments: false,

  isContent: computed.alias('model.isContent'),
  isCarousel: computed.alias('model.isCarousel'),
  isOrganization: computed.alias('model.isOrganization'),

  feedItemModel: computed.alias('model.feedItemModel')
});
