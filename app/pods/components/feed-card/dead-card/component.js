import { get, set } from '@ember/object';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedCard-DeadCard'],
  classNameBindings: ['hideCompletely:hide-completely'],
  model: null,
  deadModel: null,

  cardSize: null,
  isMidsize: equal('cardSize', 'midsize'),
  isCompact: equal('cardSize', 'compact'),

  hideCompletely: false,

  didReceiveAttrs() {
    const hasBeenRemoved = get(this, 'model.hasBeenRemoved');

    let deadModel = {
      title: 'Post Deleted',
      content: 'This post has been deleted.',
      id: get(this, 'model.id'),
      contentId: get(this, 'model.id'),
      isNews: false,
      isEvent: false,
      isMarket: false,
      primaryImageUrl: 'https://subtext-misc.s3.amazonaws.com/default_HereCast_share.png'
    }

    if (hasBeenRemoved) {
      deadModel.title = 'Post Removed';
      deadModel.content = 'This post has been removed';
    }

    set(this, 'deadModel', deadModel);
  }
});
