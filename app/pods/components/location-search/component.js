import Ember from 'ember';

const { get, set, run, computed, isPresent } = Ember;

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
        set(this, 'displaySuggestions', false);
        this.send('reset');
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

  locationQueryChanged: function() {
    const query = get(this, 'locationQuery') || "";

    if(query.length > 3) {
      run.debounce(this, this.getSuggestions, 900);
    }
  }.observes('locationQuery'),

  didInitAttrs() {
    this._super(...arguments);
    this.set('locationQuery', get(this,'location'));
  },

  didUpdateAttrs() {
    this._super(...arguments);
    const inputHasFocus = (this.$(':focus') === this.$('input'));
    if(!inputHasFocus) {
      set(this, 'locationQuery', this.attrs.location.value);
    }
  },

  getSuggestions() {
    run.next(() => {
      const query = get(this, 'locationQuery');
      const location = get(this, 'location') || "";

      if ( query !== location ) {
        const geocoderService = get(this, 'geocoderService');
        set(this, 'suggestions',
          geocoderService.geocode(query)
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
