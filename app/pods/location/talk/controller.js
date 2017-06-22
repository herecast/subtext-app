import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const {
  get,
  set,
  inject
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  modals: inject.service(),
  userLocation: inject.service('user-location'),
  secondaryBackground: true,

  queryParams: ['query', 'page', 'per_page'],

  init() {
    this._super(...arguments);

    // Used in conjuction with MaintainScroll route mixin
    get(this, 'userLocation').on('locationDidChange', ()=>{
      set(this, 'scrollPosition', 0);
    });
  },

  page: 1,
  per_page: 24,

  defaultQuery: 'Everything',
  query: 'Everything'
});
