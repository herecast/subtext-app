import Ember from 'ember';
import moment from 'moment';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(Scroll, Authorized, {

  model() {
    return this.store.createRecord('market-post', {
      publishedAt: moment()
    });
  },

  redirect() {
    this.transitionTo('market.new.details');
  },

  actions: {
    afterDiscard() {
      this.transitionTo('market.all');
    },

    afterDetails() {
      this.transitionTo('market.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('market.new.preview');
    },

    afterPublish(post) {
      this.transitionTo('market.show', post.get('id'));
    },

    backToDetails() {
      this.transitionTo('market.new.details');
    }
  }
});
