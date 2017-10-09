import Ember from 'ember';

const {
  computed,
  inject: {service},
  isPresent,
  get
} = Ember;

export default Ember.Mixin.create({
  commentsService: service('content-comments'),

  comments: computed.oneWay('commentsQuery'),

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
