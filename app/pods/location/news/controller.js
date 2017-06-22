import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const { computed, inject, get, set } = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  userLocation: inject.service(),
  queryParams: ['query', 'organization', 'page', 'per_page'],

  page: 1,
  per_page: 13,

  defaultQuery: 'Everything',
  defaultOrganization: 'Everyone',

  query: 'Everything',
  organization: 'Everyone',

  init() {
    this._super(...arguments);

    // Used in conjuction with MaintainScroll route mixin
    get(this, 'userLocation').on('locationDidChange', ()=>{
      set(this, 'scrollPosition', 0);
    });
  },

  showReset: computed('organization', 'query', 'location', function() {
    const isDefaultOrganization = this.get('defaultOrganization') === this.get('organization');
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');

    return !isDefaultOrganization || !isDefaultQuery;
  }),

  actions: {
    resetFilters() {
      const params = {
        organization: this.get('defaultOrganization'),
        query: this.get('defaultQuery')
      };

      this.send('resetFilter', 'location.news', params);
    }
  }
});
