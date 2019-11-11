import { get, set } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  model: null,
  deadModel: null,

  activeImageUrl: 'https://subtext-misc.s3.amazonaws.com/default_HereCast_share.png',

  didReceiveAttrs() {
    const hasBeenRemoved = get(this, 'model.hasBeenRemoved');

    let deadModel = {
      title: 'Post Deleted',
      content: 'This post has been deleted.',
      isNews: false,
      isEvent: false,
      isMarket: false,
      images: []
    }

    if (hasBeenRemoved) {
      deadModel.title = 'Post Removed';
      deadModel.content = 'This post has been removed';
    }

    set(this, 'deadModel', deadModel);
  }
});
