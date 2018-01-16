import Ember from 'ember';

const {computed, get, inject } = Ember;

export default Ember.Component.extend({
  features: inject.service('feature-flags'),
  comments: null,
  parentContentId: null,

  goodComments: computed.filter('comments', function(comment){
    return get(comment, 'hasUserName');
  }),

  sortedComments: computed.sort('goodComments', function(comment1, comment2) {
    const publishedAt1 = get(comment1, 'publishedAt');
    const publishedAt2 = get(comment2, 'publishedAt');

    const diff = publishedAt1.diff(publishedAt2);

    if (diff < 0) {
      return 1;
    } else if (diff > 0){
      return -1;
    }
    return 0;
  })
});
