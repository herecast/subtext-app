import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';
import _ from 'lodash';

const {
  get,
  set,
  setProperties,
  on,
  observer,
  run,
  RSVP:{Promise},
  inject:{service},
  isBlank
} = Ember;

// Alternative for Object.values()
function getValues(object) {
  return _.values(object);
}

export default Ember.Route.extend(NavigationDisplay, InfinityRoute, History, {
  hideFooter: true,

  userLocation: service(),
  session: service(),
  search: service(),
  fastboot: service(),
  history: service(),

  queryParams: {
    page: {refreshModel: true},
    query: {refreshModel: true},
    radius: {
      refreshModel: true
    },
    location: {
      refreshModel: true
    },
    type: {
      refreshModel: true
    }
  },

  beforeModel(transition) {
    if ('query' in transition.queryParams) {
      if (transition.queryParams['query'].length > 0) {
        set(this, 'search.searchActive', true);
      }
    }

    if ('location' in transition.queryParams && transition.queryParams['location'].length > 0) {

      const queryLocationId = transition.queryParams['location'];
      const isFastBoot = get(this, 'fastboot.isFastBoot');
      const isFirstRoute = get(this, 'history.isFirstRoute');
      const isAuthenticated = get(this, 'session.isAuthenticated');
      const locationIdIsDefault = get(this, 'userLocation.defaultLocationId') === queryLocationId;

      if(!isFastBoot && isAuthenticated && isFirstRoute && locationIdIsDefault) {
        //Fastboot redirected to default location because it doesn't handle
        //session/authentication.
        //
        //The purpose of this is to refresh this with the user's location if
        //fastboot selected the default location because it didn't know the user
        //was signed in. (they also don't have the location cookie)
        const currentUser = get(this, 'session.currentUser');
        if(currentUser && currentUser.then) {
          return currentUser.then((user) => {
            const userLocationId = get(user, 'locationId');

            if(userLocationId !== queryLocationId) {
              /**
               * User location does not match the one in the URL
               */


              /** Flatten params into array of model params
               *
               * {application: {}, feed: {}, 'feed.show': {id: 1}}
               * converted to:
               * [1]
               */
              const modelParams = [].concat.apply([],
                getValues(transition.params).map(i => getValues(i))
              );

              const newQueryParams = Object.assign({}, transition.queryParams, {
                location: get(user, 'locationId')
              });

              // Necessary to allow a new transition with queryParams
              // see: https://github.com/emberjs/ember.js/issues/12169
              transition.abort();

              // Transition to user's location now that we have it.
              this.transitionTo(transition.targetName, ...modelParams, {
                queryParams: newQueryParams
              });
            } else {
              return this._setupActiveLocation(transition);
            }
          });
        }
      } else {
        return this._setupActiveLocation(transition);
      }
    } else if (transition.targetName !== 'feed.show' && transition.targetName !== 'feed.show-instance') {
      const userLocation = get(this, 'userLocation');

      // Make sure we have a location already, if not direct user to
      // index page for selecting a location.
      if (!get(userLocation, 'selectedLocationId')) {
        this.transitionTo('index');
      }
    }
  },

  hideSearchBox: on('deactivate', function() {
    // transitioning away, let's close the search box
    set(this, 'search.searchActive', false);
  }),

  reloadOnAuthentication: observer('session.isAuthenticated', function() {
    run.once(() => this.refresh());
  }),

  getModel(params) {
    return new Promise((resolve, reject) => {
      const isAuthenticated = get(this, 'session.isAuthenticated');
      const isFastBoot = get(this, 'fastboot.isFastBoot');

      if (params.radius !== 'myStuff' || (!isFastBoot && isAuthenticated)) {
        get(this, 'userLocation.location').then((location) => {
          return this.infinityModel('feed-content', {
            startingPage: params.page,
            perPage: 20,
            location_id: get(location, 'id'),
            radius: params.radius,
            query: params.query,
            content_type: params.type
          });
        }).then(resolve, reject);
      } else {
        resolve([]);
      }
    });
  },

  model(params, transition) {
    if (transition.targetName !== 'feed.show' && transition.targetName !== 'feed.show-instance') {
      return this.getModel(params);
    } else {
      return [];
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
   * That the feed is reloaded with the user's location
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
    const userLocation = get(this, 'userLocation');

    if('location' in transition.queryParams) {
      return this.store.findRecord('location', transition.queryParams.location).then((location) => {
        userLocation.setActiveLocationId(get(location, 'id'));
      }).catch((e) => {
        console.error(e);

        console.error("This location most likely does not exist on the back-end:", transition.queryParams.location);
        // We have a bad location in the URL. Clear it out and start over.
        userLocation.setActiveLocationId(null);
        userLocation.clearLocationCookie();
        const redirects = get(this, 'session._locationRedirect') || 0;
        if(!redirects || redirects < 2) {
          this.transitionTo('index');
          set(this, 'session._locationRedirect', (redirects + 1));
        } else {
          throw new Error('Too many location redirects');
        }
      });
    }
  },
});
