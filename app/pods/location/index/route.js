import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';

const { inject, get } = Ember;

export default Ember.Route.extend(NavigationDisplay, InfinityRoute, History, {
  hideFooter: true,

  userLocation: inject.service('user-location'),

  queryParams: {
    page: {refreshModel: true},
    radius: {
      replace: true,
      refreshModel: true
    }
  },

  model(params) {
    return get(this, 'userLocation.location').then((location) => {
      return this.infinityModel('feed-content', {
        startingPage: params.page,
        perPage: 20,
        location_id: get(location, 'id'),
        radius: params.radius
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
