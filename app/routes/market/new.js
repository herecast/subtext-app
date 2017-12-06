import Ember from 'ember';
import moment from 'moment';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import BaseUserLocation from 'subtext-ui/mixins/routes/base-user-location';

const { get, run, inject, computed } = Ember;

export default Ember.Route.extend(Scroll, Authorized, SocialSharing, BaseUserLocation, {
  location: inject.service('window-location'),
  currentUserEmail: computed.oneWay('session.currentUser.email'),

  model(params, transition) {
    const newRecordValues = {
      publishedAt: moment(),
      promoteRadius: 10,
      contactEmail: get(this, 'currentUserEmail'),
      ugcJob: params.job
    };

    if ('organization_id' in transition.queryParams) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('market-post', newRecordValues);
      });
    } else {
      return this.store.createRecord('market-post', newRecordValues);
    }
  },

  redirect(params, transition) {
    this.transitionTo('market.new.details', { queryParams: transition.queryParams });
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting a default publishedAt value.
  hasDirtyAttributes(model) {
    return Object.keys(model.changedAttributes()).length > 1;
  },

  attemptDiscard(model, transition) {
    const confirmed = confirm('Are you sure you want to discard this post?');

    if (confirmed) {
      model.destroyRecord();
    } else {
      transition.abort();
    }
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const model = get(this, 'controller.model');

      // We want to let the user continue to navigate through the new post form
      // routes (details/promotion/preview) without discarding changes, but as
      // soon as they try to leave those pages, prompt them with the dialog.
      const isExitingForm = !transition.targetName.match(/^market\.new/);

      if (isExitingForm && this.hasDirtyAttributes(model)) {
        this.attemptDiscard(model, transition);
      }
    },

    afterDiscard() {
      this.transitionTo('feed');

    },

    afterDetails() {
      this.transitionTo('market.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('market.new.preview');
    },

    afterPublish(post) {
      const locationService = get(this, 'location');

      run.next(()=>{
        post.set('listservIds', []);
        SocialSharing.checkFacebookCache(locationService, post).catch((e)=>{
          console.log(e);
          // Do nothing, don't raise error.
        }).finally(() => {
          this.transitionTo('feed.show', post.get('id'), {
            queryParams: {
              type: 'market'
            }
          });
        });
      });
    },

    backToDetails() {
      this.transitionTo('market.new.details');
    }
  }
});
