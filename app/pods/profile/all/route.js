import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';
import idFromSlug from 'subtext-ui/utils/id-from-slug';

const { get, set, inject } = Ember;

export default Ember.Route.extend(InfinityRoute, History, {
  session: inject.service(),
  fastboot: inject.service(),

  queryParams: {
    query: {refreshModel: true},
    show: {refreshModel: true},
  },

  _redirectToPublicView() {
    return this.replaceWith(this.routeName, {
      queryParams: {
        show: null
      }
    });
  },

  _getOrganizationId() {
    const profileParams = this.paramsFor('profile');
    return idFromSlug(profileParams.organizationId);
  },

  beforeModel() {
    const params = this.paramsFor(this.routeName);

    // Redirect the user if they do not have access to view this content
    if ('show' in params && params.show && !get(this, 'fastboot.isFastBoot')) {
      if (get(this, 'session.isAuthenticated')) {
        return get(this, 'session.currentUser').then(currentUser => {
          if (!(currentUser && currentUser.isManagerOfOrganizationID(this._getOrganizationId()))) {
            return this._redirectToPublicView();
          }
        });
      } else {
        return this._redirectToPublicView();
      }
    }
  },

  model(params) {
    // Do not attempt to render content in fastboot if we need to first determine if user has access to it
    const hideContent = ('show' in params && params.show && get(this, 'fastboot.isFastBoot'));

    return hideContent ? [] : this.infinityModel('feed-item', {
        organization_id: this._getOrganizationId(),
        query: params.query,
        show: params.show
      });
  },

  actions: {
    loading(transition) {
      const targetName = get(transition, 'targetName');

      if (targetName === 'profile.all.index') {
        let controller = this.controllerFor(this.routeName);

        set(controller, 'isLoading', true);

        transition.promise.finally(function() {
          set(controller, 'isLoading', false);
        });
      }
    },

    didTransition() {
      if(!get(this, 'fastboot.isFastBoot')) {
        Ember.$('html,body').scrollTop(0);

        const model = this.modelFor('profile');

        get(this, 'tracking').profileImpression(model);
      }
    }
  }
});
