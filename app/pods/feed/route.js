import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';
import moment from 'moment';

const {
  isPresent,
  get,
  set,
  setProperties,
  on,
  RSVP,
  RSVP:{Promise},
  inject:{service},
  isBlank
} = Ember;

export default Ember.Route.extend(NavigationDisplay, InfinityRoute, History, {
  hideFooter: true,

  userLocation: service(),
  session: service(),
  search: service(),
  fastboot: service(),
  history: service(),
  logger: service(),

  queryParams: {
    query: {refreshModel: true},
    radius: {
      refreshModel: true
    },
    location: {
      refreshModel: true
    },
    type: {
      refreshModel: true
    },
    startDate: {
      refreshModel: true
    },
    endDate: {
      refreshModel: true
    }
  },

  beforeModel(transition) {
    if (transition.targetName !== 'feed.show' && transition.targetName !== 'feed.show-instance') {
      if (! ('location' in transition.queryParams)) {
        transition.abort();

        const userLocation = get(this, 'userLocation');

        this.transitionTo(transition.targetName, {queryParams: {
          location: get(userLocation, 'selectedOrDefaultLocationId')
        }});

        return;
      }
    }

    if ('query' in transition.queryParams) {
      if (transition.queryParams['query'].length > 0) {
        set(this, 'search.searchActive', true);
      }
    }


    this._setupActiveLocation(transition);
  },

  hideSearchBox: on('deactivate', function() {
    // transitioning away, let's close the search box
    set(this, 'search.searchActive', false);
  }),

  getModel(params) {
    return new Promise((resolve) => {
      const isFastBoot = get(this, 'fastboot.isFastBoot');
      const selectedOrDefaultLocationId = get(this, 'userLocation.selectedOrDefaultLocationId');

      if(params.radius === 'myStuff' && isFastBoot) {
        resolve([]);
      } else {
        if(params.radius !== 'myStuff' && params.type === 'event') {
          let startDate;
          if(isPresent(params.startDate)) {
            startDate = moment(params.startDate).startOf('day').format();
          }

          let endDate;
          if(isPresent(params.endDate)) {
            endDate = moment(params.endDate).endOf('day').format();
          }

          resolve(RSVP.hash({
            eventInstances: this.infinityModel('event-instance', {
              query: params.query,
              location_id: params.location || selectedOrDefaultLocationId,
              start_date: startDate,
              end_date: endDate,
              per_page: 20,
              radius: params.radius
            }),
            feedItems: []
          }));
        } else {
          resolve(RSVP.hash({
            feedItems: this.infinityModel('feed-item', {
              location_id: params.location || selectedOrDefaultLocationId,
              radius: params.radius,
              query: params.query,
              content_type: params.type
            }),
            eventInstances: []
          }));
        }
      }
    });
  },

  model(params, transition) {
    if (transition.targetName !== 'feed.show' && transition.targetName !== 'feed.show-instance') {
      return this.getModel(params, transition);
    } else {
      return null;
    }
  },

  afterModel(model, transition) {
    this._super(...arguments);

    // Use the scrollTo action on application controller when transition completes
    transition.send('scrollTo', 0);
  },

  setupController(controller, model) {
    if (isBlank(model)) {
      // We're going to back fill because this transition is
      // intending to land on the show route.
      controller.set('currentlyLoading', true);
      this.getModel(this.paramsFor(this.routeName)).then((model) => {
        setProperties(controller, {
          model,
          currentlyLoading: false
        });
      });
    } else {
      controller.set('model', model);
      controller.set('currentlyLoading', false);
    }
  },

  resetController(controller, isExiting) {
    if(isExiting) {
      controller.setProperties({
        endDate: '',
        startDate: '',
        currentlyLoading: false
      });
    }
  },

  infinityModelUpdated({lastPageLoaded}) {
    const lastPageLoadedIsNotDefaultPage = lastPageLoaded > 1;

    if (lastPageLoadedIsNotDefaultPage) {
      this.controller.trackModelUpdates(lastPageLoaded);
    }
  },

  /**
   * The following logic is to ensure if we're on the feed route when authenticating,
   * that the feed is reloaded with the user's location
   */
  activate() {
    get(this, 'session').on('authenticationSucceeded', this, '_reloadWithUserLocation');
  },

  deactivate() {
    get(this, 'session').off('authenticationSucceeded', this, '_reloadWithUserLocation');
  },

  /*## Private ##*/

  _reloadWithUserLocation() {
    const currentUser = get(this, 'session.currentUser');

    if(currentUser && currentUser.then) {
      currentUser.then((user) => {
        if(!get(this, 'isDestroying')) {
          const controller = this.controllerFor(this.routeName);
          const locationId = get(controller, 'location');
          const userLocationConfirmed = get(user, 'locationConfirmed');
          const userLocationId = get(user, 'locationId');

          if(userLocationConfirmed && locationId !== userLocationId) {
            set(controller, 'location', userLocationId);
          }
        }
      });
    }
  },

  _setupActiveLocation(transition) {

    if('location' in transition.queryParams) {
      const userLocation = get(this, 'userLocation');

      this.store.findRecord('location', transition.queryParams.location).then((location) => {
        userLocation.setActiveLocationId(get(location, 'id'));
      }).catch((e) => {
        get(this, 'logger').error(`This location most likely does not exist on the back-end: ${transition.queryParams.location}`, e);

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
});
