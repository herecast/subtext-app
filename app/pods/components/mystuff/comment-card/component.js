import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: 'Mystuff-CommentCard',

  comment: null,

  linkRoute: 'mystuff.comments.show',

  linkId: computed.readOnly('comment.parentContentId')

});
