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
    }
  }
});
