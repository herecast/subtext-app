import Ember from 'ember';
import moment from 'moment';
/* global dataLayer */

const {get, set, computed, run, $, inject:{service}} = Ember;

export default Ember.Component.extend({
  classNames: 'EventsFilter',

  activeCategories: [],
  showCategoryChooser: false,

  api: service(),
  modals: service(),
  session: service(),

  categories: [],

  init() {
    this._super(...arguments);
    get(this, 'api').getEventCategories().then((response) => {
      set(this, 'categories', response.event_categories);
    });
  },

  hasActiveCategories: computed.gt('activeCategories.length', 0),

  returnToTop() {
    run.later(() => {
      $('html, body').animate({ scrollTop: 0 }, 'slow');
    }, 100);
  },

  _gtmTrackEvent(name, content='') {
    get(this,'session').incrementEventSequence('events-interactions')
    .then((eventSequenceIndex) => {
      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event': name,
          'content': content,
          'url': window.location.href,
          'event-sequence': eventSequenceIndex,
          'event_day': moment().format('YYYY-MM-DD')
        });
      }
    });
  },

  actions: {
    toggleCategoryChooser(open) {
      set(this, 'showCategoryChooser', open);
      if (open) {
        this._gtmTrackEvent('events-choose-category-clicked');
      }
    },

    clickCategory(category) {
      const activeCategories = get(this, 'activeCategories') || [];

      if (activeCategories.indexOf(category) >= 0) {
        this.attrs.removeCategory(category);
        this._gtmTrackEvent('events-selected-category', `${category}-removed`);
      } else {
        this.attrs.addCategory(category);
        this._gtmTrackEvent('events-selected-category', `${category}-added`);
      }

      this.send('toggleCategoryChooser', false);
      this.returnToTop();
    },

    clearCategories() {
      this.attrs.clearCategories();
      this._gtmTrackEvent('events-selected-category', 'Cleared-All');
      this.returnToTop();
    },

    openCalendarWidget() {
      get(this, 'modals').showModal('modals/date-picker').then((date) => {
        this._gtmTrackEvent('events-jumped-to-date', date);
        this.attrs.jumpToDay(date);
        this.returnToTop();
      });
      this._gtmTrackEvent('events-clicked-day-dropdown');
    }
  }
});
