import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';
import Dates from 'subtext-ui/lib/dates';

export default Ember.Mixin.create(TrackEvent, {
  scrollMaintainer: Ember.inject.service('scroll-maintainer'),

  queryParams: {
    query: {
      refreshModel: true
    },
    category: {
      refreshModel: true
    },
    location: {
      refreshModel: true
    },
    organization: {
      refreshModel: true
    },
    date_start: {
      refreshModel: true
    },
    date_end: {
      refreshModel: true
    },
    page: {
      refreshModel: true
    }
  },

  goToPage(page) {
    const perPage = this.controller.get('per_page');
    const currentUrl = window.location.href;
    this.set('scrollMaintainer.position', 0);
    this.transitionTo({
      queryParams: {page: page, per_page: perPage}
    }).then(()=>{
      this.send('trackPageView', currentUrl);
    });
  },

  // Set the query params on the parent events controller so that it's
  // available in the filter on the index and show pages.
  setupFilter(controllerName, filterParams) {
    const controller = this.controllerFor(controllerName);

    // This logic is used to prevent API requests from returning and overriding
    // the 'query' inputs as a user is typing. It handles the initial page load,
    // other filters changing, and the dual-input on the event filter for query
    // and category.
    const updateFilterParams = (controller.get('query') === filterParams.query) ||
      Ember.isBlank(filterParams.query) || Ember.isBlank(controller.get('query')) ||
      filterParams.query === 'Everything';

    if (updateFilterParams) {
      controller.setProperties(filterParams);
    }
  },

  _getTrackingArguments(filterParams) {
    const trackParams = {};

    if (filterParams.category) {
      trackParams.category = filterParams.category;
    }

    if (filterParams.date_start && filterParams.date_end) {
      trackParams.dateSummary = Dates.dateSummary(
        filterParams.date_start, filterParams.date_end
      );
    }

    if (filterParams.location) {
      trackParams.location = filterParams.location;
    }

    if (filterParams.query) {
      trackParams.query = filterParams.query;
    }

    if (filterParams.organization) {
      trackParams.organization = filterParams.organization;
    }

    return trackParams;
  },

  actions: {
    updateFilter(filterParams) {
      filterParams.page = 1;

      this.trackEvent('searchContent', this._getTrackingArguments(filterParams));

      this.transitionTo({queryParams: filterParams});
    },

    prevPage() {
      const prevPage = this.controller.get('page') - 1;

      this.trackEvent('selectNavControl', {
        navControlGroup: 'Paging',
        navControl: 'previous'
      });

      this.goToPage(prevPage);
    },

    nextPage() {
      const nextPage = this.controller.get('page') + 1;

      this.trackEvent('selectNavControl', {
        navControlGroup: 'Paging',
        navControl: 'next'
      });

      this.goToPage(nextPage);
    },

    firstPage() {
      this.goToPage(1);
    },

    resetFilter(controllerName, filterParams) {
      const controller = this.controllerFor(controllerName);

      filterParams['startDate'] = filterParams['date_start'];
      filterParams['stopDate'] = filterParams['date_end'];
      controller.setProperties(filterParams);
      this.send('updateFilter', filterParams);
    }
  }
});
