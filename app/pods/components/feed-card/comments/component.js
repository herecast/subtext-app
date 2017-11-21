import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  contentModel: null,
  promotionMenuOpen: false,

  parentContentId: computed.reads('contentModel.contentId'),
  comments: computed.reads('contentModel.comments'),
  commentCount: computed.reads('contentModel.commentCount'),
  contentTitle: computed.reads('contentModel.title')
});
