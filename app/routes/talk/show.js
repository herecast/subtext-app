import Ember from 'ember';
import RouteMetaMixin from '../../mixins/routes/social-tags';

const { set } = Ember;

export default Ember.Route.extend(RouteMetaMixin, {
  contentComments: Ember.inject.service('content-comments'),

  modelImageKey: 'imageUrl',
  modelForMetaTags: function() {
    return this.modelFor(this.routeName).talk;
  },

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

  afterModel(model) {
    const titleToken = model.talk.get('title');

    set(this, 'titleToken', titleToken);
  },

  setupController(controller, model) {
    controller.setProperties({
      model: model.talk,
      comments: model.comments
    });
  }
});
