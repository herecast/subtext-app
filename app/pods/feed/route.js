import Route from '@ember/routing/route';
import { isBlank, isPresent } from '@ember/utils';
import { setProperties, set, get } from '@ember/object';
import { on } from '@ember/object/evented';
import RSVP, { Promise } from 'rsvp';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import VariableInfinityModelParams from 'subtext-app/mixins/routes/variable-infinity-model-params';
import History from 'subtext-app/mixins/routes/history';
import NavigationDisplay from 'subtext-app/mixins/routes/navigation-display';
import ShowUserLocationBar from 'subtext-app/mixins/routes/show-user-location-bar';
import moment from 'moment';
import $ from 'jquery';

export default Route.extend(NavigationDisplay, VariableInfinityModelParams, History, ShowUserLocationBar, {
  hideFooter: true,
  isTransitioning: false,

  userLocation: service(),
  session: service(),
  search: service(),
  fastboot: service(),
  logger: service(),
  infinity: service(),

  queryParams: {
    query: { refreshModel: true },
    type: { refreshModel: true },
    startDate: { refreshModel: true },
    endDate: { refreshModel: true },
    page: { refreshModel: true },
  },

  hasLoadedInitialSetOfItems: false,

  beforeModel(transition) {
    if ('query' in transition.queryParams) {
      if (transition.queryParams['query'].length > 0) {
        set(this, 'search.searchActive', true);
      }
    }

    if ('type' in transition.queryParams && isPresent(transition.queryParams['type'])) {
      let type = transition.queryParams['type'];
      if (type.length > 0) {
        set(this, 'search.activeFilter', type);
      }
    } else {
      set(this, 'search.activeFilter', null);
    }
  },

  hideSearchBox: on('deactivate', function() {
    set(this, 'search.searchActive', false);
  }),

  getModel(params) {
    if (isBlank(params.locationId)) {
      params.locationId = get(this, 'userLocation.activeUserLocationId');
    }

    return new Promise((resolve) => {
      if ( get(this, 'fastboot.isFastBoot')) {
        resolve([]);
      } else if (params.type === 'calendar') {
        let startDate;
        if(isPresent(params.startDate)) {
          startDate = moment(params.startDate).startOf('day').format();
        }

        let endDate;
        if(isPresent(params.endDate)) {
          endDate = moment(params.endDate).endOf('day').format();
        }

        resolve(RSVP.hash({
          eventInstances: this.infinity.model('event-instance', {
            location_id: params.locationId,
            query: params.query,
            start_date: startDate,
            end_date: endDate,
            per_page: params.perPage,
            modelPath: 'controller.model.eventInstances',
            startingPage: params.page || 1
          }, this.ExtendedInfinityModel),
          feedItems: []
        }));
      } else {
        resolve(RSVP.hash({
          feedItems: this.infinity.model('feed-item', {
            location_id: params.locationId,
            query: params.query,
            per_page: params.perPage,
            content_type: params.type,
            modelPath: 'controller.model.feedItems',
            startingPage: params.page || 1
          }, this.ExtendedInfinityModel),
          eventInstances: []
        }));
      }
    });
  },

  model(params, transition) {
    if (transition.targetName !== 'feed.show' && transition.targetName !== 'feed.show-instance') {
      const controller = this.controllerFor(this.routeName);

      controller.modelLoadHasStarted();

      return this.getModel(params)
      .then((after) => {
        controller.modelLoadHasEnded();
        return after;
      });
    } else {
      return null;
    }
  },

  afterModel() {
    this._super(...arguments);

    if (!get(this, 'fastboot.isFastBoot')) {
      // Use the scrollTo action on application controller when transition completes
      next(() => {
        $('html,body').scrollTop(0);
      });
    }
  },

  setupController(controller, model) {
    if (isPresent(model)) {
      controller.set('model', model);
    }
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      setProperties(controller, {
        endDate: '',
        startDate: ''
      });
    }
  },

  infinityModelUpdated({lastPageLoaded}) {
    const lastPageLoadedIsNotDefaultPage = lastPageLoaded > 1;

    if (lastPageLoadedIsNotDefaultPage) {
      this.controller.trackModelUpdates(lastPageLoaded);
    }
  },

  actions: {
    loadFeedFromElsewhere(childContentLocationId) {
      let controller = this.controllerFor(this.routeName);
      let params = this.paramsFor(this.routeName);

      if (childContentLocationId && !get(this, 'session.isAuthenticated')) {
        params.locationId = childContentLocationId;
      }

      controller.modelLoadHasStarted();

      this.getModel(params)
      .then((model) => {
        set(controller, 'model', model);
        controller.modelLoadHasEnded();
      });
    }
  }
});
