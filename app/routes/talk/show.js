import Ember from 'ember';

export default Ember.Route.extend({
  promotion: Ember.inject.service('promotion'),
  contentComments: Ember.inject.service('content-comments'),

  model(params)  {
    const comments = new Ember.RSVP.Promise((resolve) => {
      this.get('contentComments').getComments(params.id).then(comments => {
        resolve(comments.toArray());
      });
    });

    return Ember.RSVP.hash({
      talk: this.store.findRecord('talk', params.id, { reload: true }),
      comments: comments
    });
  },

  setupController(controller, model) {
    controller.setProperties({
      model: model.talk,
      comments: model.comments
    });

    this.get('promotion').find(model.talk.get('contentId')).then((promotion) => {
      controller.set('relatedPromotion', promotion);
    });
  }
});
