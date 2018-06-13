import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import VariableInfinityModelParams from 'subtext-ui/mixins/routes/variable-infinity-model-params';
import History from 'subtext-ui/mixins/routes/history';
import idFromSlug from 'subtext-ui/utils/id-from-slug';

const { get, set, isPresent, inject:{service} } = Ember;

export default Ember.Route.extend(InfinityRoute, VariableInfinityModelParams, History, {
  session: service(),
  fastboot: service(),

  queryParams: {
    query: {refreshModel: true},
    show: {refreshModel: true},
    startDate: { refreshModel: true },
  },

  initialLoad: true,

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

  model(params, transition) {
    if (transition.targetName !== 'profile.all.show' && transition.targetName !== 'profile.all.show-instance') {
      return this.getModel(params, transition);
    } else {
      return null;
    }
  },

  getModel(params) {
    // Do not attempt to render content in fastboot if we need to first determine if user has access to it
    const hideContent = ('show' in params && params.show && get(this, 'fastboot.isFastBoot'));

    if (hideContent) {
      return [];
    } else {
      const controller = this.controllerFor(this.routeName);
      const organization = this.modelFor('profile');
      const initialLoad = get(this, 'initialLoad');
      const calendarViewIsDefault = get(organization, 'calendarViewIsDefault');
      const postsOnlyViewIsDefault = get(organization, 'postsOnlyViewIsDefault');

      let options = {
        organization_id: this._getOrganizationId(),
        query: params.query,
        show: params.show,
        startingPage: params.page || 1
      };

      if (get(controller, 'showCalendarView') || (calendarViewIsDefault && initialLoad)) {
        options.content_type = 'calendar';
        options.sort_by = 'starts_at';
        options.sort_order = 'asc';
      } else if (get(controller, 'showPostsOnlyView') || (postsOnlyViewIsDefault && initialLoad)) {
        options.calendar = false;
      }

      return this.infinityModel('feed-item', options, this.ExtendedInfinityModel);
    }
  },

  afterModel() {
    const controller = this.controllerFor(this.routeName);
    set(controller, 'isFirstTransition', true);
  },

  setupController(controller) {
    if (get(controller, 'showAdminCards') && get(this, 'initialLoad')) {
      set(this, 'initialLoad', false);
      this.refresh();
    } else {
      set(this, 'initialLoad', false);
    }
    this._super(...arguments);
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
      this._super(...arguments);
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
    },

    loadProfileFeedFromChild() {
      let controller = this.controllerFor(this.routeName);

      controller.set('isLoading', true);

      this.getModel(this.paramsFor(this.routeName)).then((model) => {
        controller.setProperties({
          model,
          isLoading: false
        });
      });
    },

    refreshForCalendar(resetInitialLoad=false) {
      if (resetInitialLoad) {
        set(this, 'initialLoad', true);
      }
      this.refresh();
    }
  }
});
