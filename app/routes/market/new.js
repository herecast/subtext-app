import Ember from 'ember';
import moment from 'moment';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, {
  mixpanel: Ember.inject.service('mixpanel'),

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

      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, mixpanel.getNavigationControlProperties('Create Listing', 'Discard Listing'));
      mixpanel.trackEvent('selectNavControl', props);       
    },

    afterDetails() {
      this.transitionTo('market.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('market.new.preview');
    },

    afterPublish(post) {
      this.transitionTo('market.show', post.get('id')).then(this.facebookRecache);
    },

    backToDetails() {
      this.transitionTo('market.new.details');
    }
  }
});
