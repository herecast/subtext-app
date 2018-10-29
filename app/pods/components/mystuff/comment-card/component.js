import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'Mystuff-CommentCard',

  comment: null,

  linkRoute: 'mystuff.comments.show',

  linkId: readOnly('comment.parentContentId')

});
