import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const {
  inject,
  get,
  set
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  userLocation: inject.service(),

  queryParams: ['page'],
  page: 1,

  init() {
    this._super(...arguments);

    // Used in conjuction with MaintainScroll route mixin
    get(this, 'userLocation').on('locationDidChange', ()=>{
      set(this, 'scrollPosition', 0);
    });
  },
});
