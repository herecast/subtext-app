import { get } from '@ember/object';
import { readOnly, filter, gt } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-CommentCard'],

  parentContent: null,
  casterId: null,

  comments: readOnly('parentContent.comments'),

  filteredComments: filter('comments', function(comment) {
    return parseInt(get(comment, 'casterId')) === parseInt(get(this, 'casterId'));
  }),
  hasFilteredComments: gt('filteredComments.length', 0),

  linkRoute: 'caster.show',

  linkId: readOnly('parentContent.id')
});
