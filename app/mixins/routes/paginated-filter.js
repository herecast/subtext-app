import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    r: {
      refreshModel: true
    },
    page: {
      refreshModel: true
    }
  },

  goToPage(page) {
    const perPage = this.controller.get('per_page');

    this.transitionTo({
      queryParams: {page: page, per_page: perPage}
    });
  },

  // Set the query params on the parent events controller so that it's
  // available in the filter on the index and show pages.
  setupFilter(controllerName, filterParams) {
    const controller = this.controllerFor(controllerName);

    if (typeof controller.get('location') === 'undefined') {
      controller.setProperties(filterParams);
    }
  },

  actions: {
    updateFilter(filterParams) {
      filterParams.page = 1;

      this.transitionTo({queryParams: filterParams});
      this.refresh();
    },

    prevPage() {
      const prevPage = this.controller.get('page') - 1;

      this.goToPage(prevPage);
    },

    nextPage() {
      const nextPage = this.controller.get('page') + 1;

      this.goToPage(nextPage);
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
