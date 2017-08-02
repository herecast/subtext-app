import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';
import LocationMixin from 'subtext-ui/mixins/controllers/location';

const {
  inject,
  get,
  computed,
  set
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, LocationMixin, {
  channel: "index",
  userLocation: inject.service(),
  selectedLocation: computed.readOnly('userLocation.activeLocation'),
  queryParams: ['page'],
  page: 1,

  init() {
    this._super(...arguments);

    // Used in conjuction with MaintainScroll route mixin
    get(this, 'userLocation').on('locationDidChange', ()=>{
      set(this, 'scrollPosition', 0);
    });
  }
});
