import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from '../../mixins/routes/authorized';

export default Ember.Route.extend(Scroll, Authorized, {
  model(params) {
    return this.store.find('market-post', params.id);
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
