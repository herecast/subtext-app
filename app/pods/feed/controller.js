import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const {
  inject:{service},
  get,
  computed,
  assign,
  set
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  channel: "feed",

  userLocation: service(),
  tracking: service(),
  windowLocation: service(),
  session: service(),
  search: service(),

  queryParams: ['page', 'query', 'location', 'type', 'radius'],
  query: computed.alias('search.query'),
  location: '',
  type: '',
  page: 1,
  radius: '10',

  isMyStuffOnly: computed.equal('radius', 'myStuff'),

  isSearchActive: computed.notEmpty('query'),

  showingDetailInFeed: null,

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
        'url': get(this, 'windowLocation').href(),
        'event-sequence': eventSequenceIndex
      });
    });
  },

  trackIntegratedDetailLoaded(contentId) {
    this._gtmTrackEvent('integrated-detail-loaded', `integrated-detail-loaded-${contentId}`);
  },

  trackModelUpdates(lastPageUpdated) {
    this._gtmTrackEvent('end-of-index-reached', `last-page-updated-${lastPageUpdated}`);
  },

  trackDetailPageViews(contentId) {
    this._gtmTrackEvent('detail-page-viewed', `detail-page-viewed-${contentId}`);
  },

  trackScrollPastIntegratedDetail(contentId) {
    this._gtmTrackEvent('scroll-past-integrated-detail', `scroll-past-integrated-detail-${contentId}`);
  },

  _transitionToFeed(overrides = {}) {
    const defaults = {
      location: get(this, 'location'),
      radius: get(this, 'radius'),
      type: get(this, 'type'),
      query: get(this, 'query'),
      page: 1
    };

    this.transitionToRoute('feed', {
      queryParams: assign({}, defaults, overrides)
    });
  },

  actions: {
    filterType(type) {
      set(this, 'type', type);
    },

    changeRadius(radius) {
      get(this, 'tracking').changeSearchRadius(radius, {
        channel: get(this, 'channel'),
        oldRadius: get(this, 'radius')
      });

      this._transitionToFeed({
        radius: radius
      });
    },

    chooseMyStuffOnly() {
      this.send('changeRadius', 'myStuff');
    },

    chooseLocation(location) {
      const userLocation = get(this, 'userLocation');

      get(this, 'tracking').push({
        event: "ChooseLocation",
        location_id: get(userLocation, 'location.id'),
        new_location_name: get(location, 'name'),
        new_location_id: get(location, 'id')
      });

      userLocation.saveSelectedLocationId(get(location, 'id'));
      this._transitionToFeed({
        location: get(location, 'id'),
      });
    }
  }
});
