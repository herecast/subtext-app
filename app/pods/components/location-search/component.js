import { notEmpty } from '@ember/object/computed';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { A } from '@ember/array';
import { observer, computed, set, get, setProperties } from '@ember/object';

export default Component.extend({
  type: 'text',
  classNames: ['LocationSearch'],
  classNameBindings: ['displaySuggestions:open'],
  location: "",
  quickList: A(),
  suggestions: A(),

  displayQuickList: notEmpty('quickList'),
  displaySuggestions: false,
  geocoderService: service('geolocation'),

  init() {
    this._super(...arguments);
    setProperties(this, {
      locationFilterType: 'administrative_area_level_1',
      locationFilters: ['NH', 'VT'],
      locationQuery: get(this, 'location')
    });
  },

  suggestionsProxy: computed('suggestions.{[],isFulfilled}', function() {
    const values = get(this, 'suggestions');
    if(PromiseProxyMixin.detect(values)) {
      return values.get('content');
    } else {
      return values;
    }
  }),

  focusIn() {
    const displayQuickList = get(this, "displayQuickList");

    if(displayQuickList) {
      set(this, 'displaySuggestions', true);
    }
  },

  focusOut() {
    run.later(() => {
      // do my children have focus?
      const stillHasFocus = this.$(':focus').length;
      if(! stillHasFocus) {
        if (!get(this, 'isDestroyed')) {
          set(this, 'displaySuggestions', false);
          this.send('reset');
        }
      }
    }, 100);
  },

  keyUp(e) {
    const esc = 27;

    switch(e.keyCode) {
      case esc:
        this.send('reset');
        this.$('input').blur();
        break;
    }
  },

  locationQueryChanged: observer('locationQuery', function() {
    const query = get(this, 'locationQuery') || "";

    if(query.length > 3) {
      run.throttle(this, this.getSuggestions, 500);
    }
  }),

  didUpdateAttrs() {
    this._super(...arguments);
    const inputHasFocus = (this.$(':focus') === this.$('input'));
    if(!inputHasFocus) {
      set(this, 'locationQuery', get(this, 'location'));
    }
  },

  getSuggestions() {
    run.next(() => {
      const query = get(this, 'locationQuery');
      const location = get(this, 'location') || "";

      const filters = get(this, 'locationFilters') || null;
      const filterType = get(this, 'locationFilterType') || null;

      if ( query !== location ) {
        const geocoderService = get(this, 'geocoderService');
        set(this, 'suggestions',
          geocoderService.geocode(query, {
            filterType: filterType,
            filterArray: filters
          })
        );
        set(this, 'displaySuggestions', true);
      }
    });
  },

  actions: {
    getSuggestions() {
      return this.getSuggestions();
    },

    reset() {
      const location = get(this, 'location');

      set(this, 'locationQuery', location);
      set(this, 'suggestions', []);
    },

    update(val, coords) {
      const location = get(this, 'location');

      if(location !== val && isPresent(coords)) {
        //eslint-disable-next-line ember/closure-actions
        this.sendAction('setLocation', val, coords);
      }

      set(this, 'displaySuggestions', false);
    }

  }

});
