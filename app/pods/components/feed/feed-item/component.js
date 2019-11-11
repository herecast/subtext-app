import { alias, not } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedItem'],

  model: null,

  isContent: alias('model.isContent'),
  isCarousel: alias('model.isCarousel'),

  isNotHiddenFromFeed: not('model.isHiddenFromFeed'),

  feedItemModel: alias('model.feedItemModel')
});
