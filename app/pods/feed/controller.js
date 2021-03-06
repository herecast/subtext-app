import { alias, reads, notEmpty, readOnly } from '@ember/object/computed';
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { assign } from '@ember/polyfills';
import { setProperties, set, computed, get } from '@ember/object';
import { run, next, later } from '@ember/runloop';
import { Promise } from 'rsvp';
import moment from 'moment';

export default Controller.extend({
  channel: "feed",

  userLocation: service(),
  tracking: service(),
  fastboot: service(),
  windowLocation: service(),
  nags: service(),
  session: service(),
  search: service(),
  api: service(),
  history: service(),
  feedService: service('feed'),

  isFastBoot: alias('fastboot.isFastBoot'),
  nagShowing: readOnly('nags.hideAppDownloadNag'),

  currentRouteName: reads('history.currentRouteName'),

  queryParams: ['page', 'perPage', 'query', 'type', 'startDate', 'endDate'],
  query: alias('search.query'),
  type: null,
  page: 1,
  perPage: 5,
  startDate: '',
  endDate: '',
  enabledEventDays: ArrayProxy.create({ content: A([]) }),

  isSearchActive: notEmpty('query'),

  _minimimLoadingDelay: 1200,
  _animationDelayRunning: false,
  _animationDelay: null,
  _modelIsLoading: false,
  showLoadingAnimation: false,
  wantsToChangeLocation: false,

  showPioneeringFeed: readOnly('feedService.showPioneeringFeed'),
  showMyFeed: computed('currentPath', function() {
    const currentPath = get(this, 'currentPath');
    return currentPath.indexOf('myfeed') >= 0;
  }),

  init() {
    this._super(...arguments);

    setProperties(this, {
      enabledEventsQueryParams: {}
    });

    get(this, 'userLocation').on('userLocationChanged', () => {
      const currentRouteName = get(this, 'currentRouteName');

      if (currentRouteName && currentRouteName.startsWith('feed')) {
        window.scrollTo(0, 0);

        next(() => {
          this._transitionToFeed({}, true);
        });
      }
    });

    get(this, 'session').on('cardSizeChanged', () => {
      this.modelLoadHasStarted();
      later(() => {
        this.modelLoadHasEnded();
      }, get(this, '_minimimLoadingDelay'))
    });
  },

  modelLoadHasStarted() {
    setProperties(this, {
      showLoadingAnimation: true,
      _animationDelayRunning: true,
      _modelIsLoading: true
    });

    if (!get(this, 'fastboot.isFastBoot')) {
      const _minimimLoadingDelay = get(this, '_minimimLoadingDelay');
      const _animationDelay = run.later(() => {
        this._animationDelayHasEnded();
      }, _minimimLoadingDelay);

      set(this, '_animationDelay', _animationDelay);
    }
  },

  modelLoadHasEnded() {
    set(this, '_modelIsLoading', false);

    if (!get(this, '_animationDelayRunning')) {
      set(this, 'showLoadingAnimation', false);
    }
  },

  _animationDelayHasEnded() {
    set(this, '_animationDelayRunning', false);

    if (!get(this, '_modelIsLoading')) {
      set(this, 'showLoadingAnimation', false);
    }
  },


  hasResults: computed('model.{eventInstances.[],feedItems.[]}', function() {
    return get(this, 'model.feedItems.length') || get(this, 'model.eventInstances.length');
  }),

  eventFilter: computed('type', function() {
    const isEventFilter = get(this, 'type') === 'calendar';

    return isEventFilter;
  }),

  willDestroy() {
    this._super(...arguments);
    get(this, 'userLocation').off('userLocationChanged');
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

  trackModelUpdates(lastPageUpdated) {
    this._gtmTrackEvent('end-of-index-reached', `last-page-updated-${lastPageUpdated}`);
  },

  trackDetailPageViews(contentId) {
    this._gtmTrackEvent('detail-page-viewed', `detail-page-viewed-${contentId}`);
  },

  _transitionToFeed(overrides = {}, loadFeedFromElsewhere=false) {
    const defaults = {
      type: get(this, 'type'),
      query: get(this, 'query'),
      startDate: '',
      endDate: ''
    };

    this.transitionToRoute('feed', {
      queryParams: assign({}, defaults, overrides)
    })
    .then(() => {
      if (loadFeedFromElsewhere) {
        this.send('loadFeedFromElsewhere');
      }
    });

  },

  queryParamsChanged({ query }) {
    const oldQueryParams = get(this, 'enabledEventsQueryParams');

    return  oldQueryParams.query !== query;
  },

  actions: {
    updateEnabledEventDays(selectedDate) {
      const enabledEventDays = get(this, 'enabledEventDays');
      const api = get(this, 'api');
      const query = get(this, 'query');
      const queryParams = {
        location_id: get(this, 'userLocation.activeUserLocationId'),
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
      this._transitionToFeed({
        type: type
      });
    },

    jumpToDay(date){
      this._transitionToFeed({
        startDate: date
      });
    }
  }
});
