import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';
import idFromSlug from 'subtext-ui/utils/id-from-slug';

const { get, set, isPresent, inject:{service} } = Ember;

export default Ember.Route.extend(InfinityRoute, History, {
  session: service(),
  userLocation: service(),
  fastboot: service(),

  queryParams: {
    query: {refreshModel: true},
    show: {refreshModel: true},
    location: {refreshModel: true}
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

  beforeModel(transition) {
    const params = this.paramsFor(this.routeName);
    const organization = this.modelFor('profile');

    if (get(organization, 'isLocationDependentOrganization') && !('location' in transition.queryParams)) {
      transition.abort();

      const locationId = get(this, 'userLocation.selectedOrDefaultLocationId');

      this.transitionTo('profile', organization, {queryParams: {
        location: locationId
      }});

      return;
    }

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

    this._setupActiveLocation(transition);
  },

  afterModel() {
    const controller = this.controllerFor(this.routeName);
    set(controller, 'isFirstTransition', true);
  },

  model(params) {
    // Do not attempt to render content in fastboot if we need to first determine if user has access to it
    const hideContent = ('show' in params && params.show && get(this, 'fastboot.isFastBoot'));

    return hideContent ? [] : this.infinityModel('feed-item', {
        organization_id: this._getOrganizationId(),
        query: params.query,
        show: params.show,
        location_id: params.location
      });
  },

  _setupActiveLocation(transition) {

    if('location' in transition.queryParams) {
      const userLocation = get(this, 'userLocation');

      this.store.findRecord('location', transition.queryParams.location).then((location) => {
        userLocation.setActiveLocationId(get(location, 'id'));
      }).catch((e) => {
        console.error(e);

        console.error("This location most likely does not exist on the back-end:", transition.queryParams.location);
        // We have a bad location in the URL. Clear it out and start over.
        userLocation.setActiveLocationId(null);
        userLocation.clearLocationCookie();
        const redirects = get(this, 'session._locationRedirect') || 0;
        if(!redirects || redirects < 2) {
          this.transitionTo({queryParams: {
            location: get(userLocation, 'defaultLocationId')
          }});

          set(this, 'session._locationRedirect', (redirects + 1));
        } else {
          throw new Error('Too many location redirects');
        }
      });
    }
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
        const model = this.modelFor('profile');
        const controller = this.controllerFor(this.routeName);
        const doNotScrollToTop =  isPresent(get(controller, 'show')) ||
                                  isPresent(get(controller, 'comingFromRouteWithShowParam')) ||
                                  !get(controller, 'isFirstTransition');

        if (!doNotScrollToTop) {
          Ember.$('html,body').scrollTop(0);
          set(controller, 'isFirstTransition', false);
        }

        get(this, 'tracking').profileImpression(model);
      }
    },

    willTransition() {
      const controller = this.controllerFor(this.routeName);
      const comingFromRouteWithShowParam = isPresent(get(controller, 'show'));

      set(controller, 'comingFromRouteWithShowParam', comingFromRouteWithShowParam);

      return true;
    }
  }
});
