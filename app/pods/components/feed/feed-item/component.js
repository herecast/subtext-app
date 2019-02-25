import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedItem'],

  model: null,
  organization: null,
  allowManageOnTile: false,
  displayAsPublic: false,

  isContent: alias('model.isContent'),
  isCarousel: alias('model.isCarousel'),
  isOrganization: alias('model.isOrganization'),

  feedItemModel: alias('model.feedItemModel')
});
