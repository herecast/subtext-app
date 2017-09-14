import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';

const { inject, get, on, set } = Ember;

export default Ember.Route.extend(NavigationDisplay, InfinityRoute, History, {
  hideFooter: true,

  userLocation: inject.service('user-location'),
  search: inject.service(),

  queryParams: {
    page: {refreshModel: true},
    radius: {
      replace: true,
      refreshModel: true
    },
    query: {refreshModel: true}
  },

  beforeModel(transition) {
    if('query' in transition.queryParams) {
      if(transition.queryParams['query'].length > 0) {
        set(this, 'search.searchActive', true);
      }
    }
  },

  hideSearchBox: on('deactivate', function() {
    // transitioning away, let's close the search box
    set(this, 'search.searchActive', false);
  }),

  model(params) {
    return get(this, 'userLocation.location').then((location) => {
      return this.infinityModel('feed-content', {
        //params 
        startingPage: params.page,
        perPage: 20,
        location_id: get(location, 'id'),
        radius: params.radius,
        query: params.query
      });
    });
  },

  infinityModelUpdated({lastPageLoaded}) {
    const lastPageLoadedIsNotDefaultPage = lastPageLoaded > 1;

    if (lastPageLoadedIsNotDefaultPage) {
      this.controller.trackModelUpdates(lastPageLoaded);
    }
  },

  actions: {
    willTransition(transition) {
      const isTransitioningToADetailPage = transition.targetName === 'location.index.show';
      if (isTransitioningToADetailPage) {
        const params = get(transition, 'params');
        const contentId = params["location.index.show"].slug;

        this.controller.trackDetailPageViews(contentId);
      }
    }
  }

});
