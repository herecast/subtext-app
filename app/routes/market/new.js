import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import Scroll from '../../mixins/routes/scroll-to-top';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import SocialSharing from 'subtext-ui/utils/social-sharing';

export default Route.extend(Scroll, Authorized, FastbootTransitionRouteProtocol, SocialSharing, {
  location: service('window-location'),
  currentUserName: readOnly('session.currentUser.name'),

  model(params, transition) {
    const newRecordValues = {
      contentType: 'market',
      authorName: get(this, 'currentUserName'),
      ugcJob: params.job
    };

    if ('organization_id' in transition.queryParams && isPresent(transition.queryParams.organization_id)) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('content', newRecordValues);
      });
    } else {
      return this.store.createRecord('content', newRecordValues);
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
      const controller = this.controllerFor(this.routeName);
      const organizationId = get(controller, 'organization_id') || null;

      if (isPresent(organizationId)) {
        this.transitionTo('profile', organizationId);
      } else {
        this.transitionTo('feed');
      }
    },

    afterDetails() {
      this.transitionTo('market.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('market.new.preview');
    },

    afterPublish(post) {
      const controller = this.controllerFor(this.routeName);
      const goToProfilePage = isPresent(get(controller, 'organization_id'));

      run.next(()=>{
        post.set('listservIds', []);

        if (goToProfilePage) {
          this.transitionTo('profile.all.show', get(controller, 'organization_id'), get(post, 'id'));
        } else {
          this.transitionTo('feed.show', post.id, {
            queryParams: {
              type: 'market'
            }
          });
        }
      });
    },

    backToDetails() {
      this.transitionTo('market.new.details');
    }
  }
});
