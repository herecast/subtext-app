import $ from 'jquery';
import { next } from '@ember/runloop';
import Route from '@ember/routing/route';
import { set, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import VariableInfinityModelParams from 'subtext-app/mixins/routes/variable-infinity-model-params';
import History from 'subtext-app/mixins/routes/history';
import idFromSlug from 'subtext-app/utils/id-from-slug';

export default Route.extend(VariableInfinityModelParams, History, {
  session: service(),
  fastboot: service(),
  infinity: service(),
  floatingActionButton: service(),

  queryParams: {
    query: {refreshModel: true},
    show: {refreshModel: true},
    startDate: { refreshModel: true },
    resetController: { refreshModel: true}
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

    return idFromSlug(profileParams.organization_id);
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

    if (get(this, 'session.isAuthenticated') && get(this, 'floatingActionButton.showContent')) {
      return get(this, 'session.currentUser').then(currentUser => {
        if ((currentUser && currentUser.isManagerOfOrganizationID(this._getOrganizationId()))) {
          const controller = this.controllerFor(this.routeName);
          set(controller, 'displayAsAdminIfAllowed', true);
        }
      });
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

      return this.infinity.model('feed-item', options, this.ExtendedInfinityModel);
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

    if (get(controller, 'resetController')) {
      controller._resetDefaults();

      next(() => {
        this.refresh();
      });
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
                                  get(controller, 'comingFromRouteWithShowParam') ||
                                  !get(controller, 'isFirstTransition');
        if (!doNotScrollToTop) {
          $('html,body').scrollTop(0);
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
