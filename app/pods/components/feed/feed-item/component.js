import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedItem'],

  model: null,

  showAnyViewCount: false,

  isContent: alias('model.isContent'),
  isCarousel: alias('model.isCarousel'),

  feedItemModel: alias('model.feedItemModel')
});
