import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(Scroll, Authorized, {
  model(params) {
    return this.store.findRecord('market-post', params.id, {reload: true});
  },

  setupController(controller, model) {
    this._super(controller, model);

    if (model.get('hasContactInfo')) {
      model.loadContactInfo();
    }
  },

  redirect() {
    this.transitionTo('market.edit.details');
  },

  actions: {
    afterDiscard() {
      this.transitionTo('market.all');
    },

    afterDetails() {
      this.transitionTo('market.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('market.edit.preview');
    },

    afterPublish(post) {
      this.transitionTo('market.show', post.id);
    },

    backToDetails() {
      this.transitionTo('market.edit.details');
    }
  }
});
