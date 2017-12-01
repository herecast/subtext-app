import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';
import moment from 'moment';

const {
  inject:{service},
  get,
  computed,
  assign,
  set,
  RSVP: {Promise}
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  channel: "feed",

  userLocation: service(),
  tracking: service(),
  windowLocation: service(),
  session: service(),
  search: service(),
  api: service(),

  queryParams: ['query', 'location', 'type', 'radius', 'startDate', 'endDate'],
  query: computed.alias('search.query'),
  location: '',
  type: '',
  radius: '10',
  startDate: '',
  endDate: '',
  enabledEventDays: Ember.ArrayProxy.create({ content: Ember.A([]) }),
  enabledEventsQueryParams: {},

  isMyStuffOnly: computed.equal('radius', 'myStuff'),

  isSearchActive: computed.notEmpty('query'),

  showingDetailInFeed: null,

  eventFilterAndNotMyStuff: computed('type', 'radius', function() {
    const isMyStuff = get(this, 'radius') === "myStuff";
    const isEventFilter = get(this, 'type') === 'event';

    return isEventFilter && !isMyStuff;
  }),

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
      startDate: '',
      endDate: ''
    };

    this.transitionToRoute('feed', {
      queryParams: assign({}, defaults, overrides)
    });
  },

  queryParamsChanged({ location_id, query, radius }) {
    const oldQueryParams = get(this, 'enabledEventsQueryParams');

    return oldQueryParams.location_id !== location_id || oldQueryParams.radius !== radius || oldQueryParams.query !== query;
  },

  actions: {
    updateEnabledEventDays(selectedDate) {
      const enabledEventDays = get(this, 'enabledEventDays');
      const api = get(this, 'api');
      const location = get(this, 'location');
      const radius = get(this, 'radius');
      const query = get(this, 'query');
      const queryParams = {
        location_id: location,
        radius: radius,
        query: query
      };
      let end, start;

      if(this.queryParamsChanged(queryParams)){
        enabledEventDays.clear();
      }

      if (enabledEventDays.content.length === 0){
        // get [T-1, T+4]

        start = moment(selectedDate).subtract(1, 'M').format('YYYY-MM-DD');
        end = moment(selectedDate).add(4, 'M').format('YYYY-MM-DD');

      } else {
        // don't worry about days in the past for now.
        const lastEvent =  enabledEventDays.get('lastObject');
        const acceptableEndOfDateRange = moment(selectedDate).add(4, 'M');

        if (moment(lastEvent.date).isBefore(acceptableEndOfDateRange)) {
          start = moment(lastEvent.date).add(1, 'd').format('YYYY-MM-DD');
          end = moment(lastEvent.date).add(4, 'M').format('YYYY-MM-DD');
        } else {
          return Promise.resolve();
        }
      }

      queryParams.start_date = start;
      queryParams.end_date = end;

      set(this, 'enabledEventsQueryParams', queryParams);

      return api.getDaysWithEvents(queryParams)
        .then(({ active_dates }) => {
          enabledEventDays.pushObjects(active_dates);
        });
    },

    filterType(type) {
      /**
       * Transition necessary because of different model types for
       * event-instances.
       * Otherwise, this throws a console error changing type from 'event'.
       */
      this.setProperties({
        currentlyLoading: true,
        model: []
      });

      this._transitionToFeed({
        type: type
      });
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
    },

    jumpToDay(date){
      this._transitionToFeed({
        startDate: date
      });
    }
  }
});
