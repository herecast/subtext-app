import Ember from 'ember';
import moment from 'moment';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';

const { get } = Ember;

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

  discardRecord(model) {
    if (confirm('Are you sure you want to discard this post?')) {
      model.destroyRecord();

      return true;
    } else {
      return false;
    }
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting a default publishedAt value.
  hasDirtyAttributes(model) {
    return Object.keys(model.changedAttributes()).length > 1;
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const model = get(this, 'controller.model');
      const exitSetup = !transition.targetName.match(/^market\.new/);

      if (exitSetup && this.hasDirtyAttributes(model) && !this.discardRecord(model)) {
        transition.abort();
      }
    },

    afterDiscard(model) {
      if (!this.hasDirtyAttributes(model) || this.discardRecord(model)) {
        this.transitionTo('market.all');

        const mixpanel = this.get('mixpanel');
        const currentUser = this.get('session.currentUser');
        const props = {};

        Ember.merge(props, mixpanel.getUserProperties(currentUser));
        Ember.merge(props, mixpanel.getNavigationControlProperties('Create Listing', 'Discard Listing'));
        mixpanel.trackEvent('selectNavControl', props);
      }
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
