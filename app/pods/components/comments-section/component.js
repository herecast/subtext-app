import { filter, sort } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  comments: null,
  parentContentId: null,

  goodComments: filter('comments', function(comment){
    return get(comment, 'hasUserName');
  }),

  sortedComments: sort('goodComments', function(comment1, comment2) {
    const publishedAt1 = get(comment1, 'publishedAt');
    const publishedAt2 = get(comment2, 'publishedAt');

    const diff = publishedAt1.diff(publishedAt2);

    if (diff > 0) {
      return 1;
    } else if (diff < 0){
      return -1;
    }
    return 0;
  })
});
