import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';

const { get, set, on, inject:{service} } = Ember;

export default Ember.Route.extend(NavigationDisplay, InfinityRoute, History, {
  hideFooter: true,

  userLocation: service(),
  session: service(),
  search: service(),

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
    if('query' in transition.queryParams) {
      if(transition.queryParams['query'].length > 0) {
        set(this, 'search.searchActive', true);
      }
    }

    const userLocation = get(this, 'userLocation');

    if('location' in transition.queryParams && transition.queryParams['location'].length > 0) {
      return this.store.findRecord('location', transition.queryParams.location).then((location) => {
        userLocation.setActiveLocationId(location.id);
      }).catch((e) => {
        console.log(e);
        // We have a bad location in the URL. Clear it out and start over.
        userLocation.setActiveLocationId(null);
        userLocation.clearLocationCookie();

        this.transitionTo('index');
      });
    } else if (transition.targetName !== 'feed.show' && transition.targetName !=='feed.show-instance') {
      // Make sure we have a location already, if not direct user to
      // index page for selecting a location.
      if(! get(userLocation, 'selectedLocationId')) {
        this.transitionTo('index');
      }
    }
  },

  hideSearchBox: on('deactivate', function() {
    // transitioning away, let's close the search box
    set(this, 'search.searchActive', false);
  }),

  getModel(params) {
    return get(this, 'userLocation.location').then((location) => {
      return this.infinityModel('feed-content', {
        startingPage: params.page,
        perPage: 20,
        location_id: get(location, 'id'),
        radius: params.radius,
        query: params.query,
        content_type: params.type
      });
    });
  },

  model(params, transition) {
    if(transition.targetName !== 'feed.show') {
      return this.getModel(params);
    } else {
      return null;
    }
  },

  setupController(controller, model) {
    if(model === null) {
      // We're going to back fill because this transition is
      // intending to land on the show route.
      this.getModel(this.paramsFor(this.routeName)).then((model)=>{
        controller.set('model', model);
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
  }
});
