import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  model: null,
  showingDetailInFeed: null,
  organization: null,
  canManage: false,
  canEditIfAllowed: false,
  displayAsPublic: false,
  hideComments: false,

  isContent: alias('model.isContent'),
  isCarousel: alias('model.isCarousel'),
  isOrganization: alias('model.isOrganization'),

  feedItemModel: alias('model.feedItemModel'),

  contentShowingInFeed: computed('feedItemModel.id', 'showingDetailInFeed', function() {
    return get(this, 'feedItemModel.id') === get(this, 'showingDetailInFeed');
  })
});
