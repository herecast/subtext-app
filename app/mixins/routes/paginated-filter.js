import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  scrollMaintainer: service('scroll-maintainer'),

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
    },
    radius: {
      refreshModel: true
    }
  },

  goToPage(page) {
    const perPage = this.controller.get('per_page');
    this.set('scrollMaintainer.position', 0);
    this.transitionTo({
      queryParams: {page: page, per_page: perPage}
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
      isBlank(filterParams.query) || isBlank(controller.get('query')) ||
      filterParams.query === 'Everything';

    if (updateFilterParams) {
      controller.setProperties(filterParams);
    }
  },

  actions: {
    updateFilter(filterParams) {
      filterParams.page = 1;
      this.transitionTo({queryParams: filterParams});
    },

    prevPage() {
      const prevPage = this.controller.get('page') - 1;
      this.goToPage(prevPage);
    },

    nextPage() {
      const nextPage = this.controller.get('page') + 1;
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
