import { reads } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  contentModel: null,
  promotionMenuOpen: false,

  parentContentId: reads('contentModel.contentId'),
  comments: reads('contentModel.comments'),
  commentCount: reads('contentModel.commentCount'),
  contentTitle: reads('contentModel.title')
});
