import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';
import LocationMixin from 'subtext-ui/mixins/controllers/location';

const {
  inject:{service},
  get,
  computed,
  set
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, LocationMixin, {
  channel: "index",

  userLocation: service(),
  tracking: service(),
  session: service(),

  selectedLocation: computed.readOnly('userLocation.activeLocation'),
  queryParams: ['page'],
  page: 1,

  init() {
    this._super(...arguments);

    // Used in conjuction with MaintainScroll route mixin
    get(this, 'userLocation').on('locationDidChange', ()=>{
      set(this, 'scrollPosition', 0);
    });
  },

  _gtmTrackEvent(name, content='') {
    get(this,'session').incrementEventSequence('index-feed-interactions')
    .then((eventSequenceIndex) => {
      get(this, 'tracking').push({
        'event': name,
        'content': content,
        'url': window.location.href,
        'event-sequence': eventSequenceIndex
      });
    });
  },

  trackModelUpdates(lastPageUpdated) {
    this._gtmTrackEvent('end-of-index-reached', `last-page-updated-${lastPageUpdated}`);
  },

  trackDetailPageViews(contentId) {
    this._gtmTrackEvent('detail-page-viewed', `detail-page-viewed-${contentId}`);
  }
});
