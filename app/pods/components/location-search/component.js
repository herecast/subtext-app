import Ember from 'ember';

const { get, set, run, computed, isPresent, observer } = Ember;

export default Ember.Component.extend({
  type: 'text',
  classNames: ['LocationSearch'],
  classNameBindings: ['displaySuggestions:open'],
  location: "",
  quickList: [],
  displayQuickList: computed.notEmpty('quickList'),
  displaySuggestions: false,
  geocoderService: Ember.inject.service('geolocation'),
  suggestions: [],
  locationFilterType: 'administrative_area_level_1',
  locationFilters: ['NH', 'VT'],

  suggestionsProxy: computed('suggestions.[]', 'suggestions.isFulfilled', function() {
    const values = get(this, 'suggestions');
    if(Ember.PromiseProxyMixin.detect(values)) {
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

  didInitAttrs() {
    this._super(...arguments);
    this.set('locationQuery', get(this,'location'));
  },

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
        this.sendAction('setLocation', val, coords);
      }

      set(this, 'displaySuggestions', false);
    }

  }

});
