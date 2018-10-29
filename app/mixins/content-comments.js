import { oneWay } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { get, computed } from '@ember/object';

export default Mixin.create({
  commentsService: service('content-comments'),

  comments: oneWay('commentsQuery'),

  commentsQuery: computed('model.{contentId,commentCount}', function() {
    const contentId = get(this, 'model.contentId');
    const commentsService = get(this, 'commentsService');

    return isPresent(contentId) ? commentsService.getComments(contentId) : [];
  }),

  actions: {
    reloadComments() {
      get(this, 'model').incrementProperty('commentCount');
    }
  }
});
