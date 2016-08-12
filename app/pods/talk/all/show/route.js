import Ember from 'ember';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import normalizeContentType from 'subtext-ui/utils/normalize-content-type';
import ResetModalScroll from 'subtext-ui/mixins/routes/reset-modal-scroll';

const { get, set } = Ember;

export default Ember.Route.extend(RouteMetaMixin, ResetModalScroll, {
  contentComments: Ember.inject.service('content-comments'),

  modelImageKey: 'imageUrl',
  modelChannel: 'talk',

  modelForMetaTags: function() {
    return this.modelFor(this.routeName).talk;
  },

  model(params)  {
    const type = normalizeContentType(params.ctype) || 'talk';

    const comments = new Ember.RSVP.Promise(resolve => {
      this.get('contentComments').getComments(params.id).then(comments => {
        resolve(comments.toArray());
      });
    });

    const hash = {
      talk: this.store.findRecord(type, params.id, { reload: true })
    };

    if (type === 'talk') {
      hash.comments = comments;
    }

    return Ember.RSVP.hash(hash);
  },

  afterModel(model) {
    const titleToken = get(model, 'talk.title');

    set(this, 'titleToken', titleToken);
  },

  setupController(controller, model) {
    controller.setProperties({
      model: model.talk,
      comments: model.comments
    });
  }
});
