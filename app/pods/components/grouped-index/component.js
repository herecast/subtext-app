import Ember from 'ember';
import sortByPublishedAt from 'subtext-ui/utils/sort-by-published-at';

const {set, inject, computed, get, isEmpty} = Ember;

export default Ember.Component.extend({
  store: inject.service(),
  userLocation: inject.service(),
  newsItems: computed.alias('news'),

  talkItems: [],
  sortedTalkItems: computed.sort('talkItems', sortByPublishedAt),
  hasTalkItems: computed.notEmpty('talkItems'),

  // isAuthenticated should be passed into the component, so `didReceiveAttrs` refires when it changes
  isAuthenticated: false,

  getTalkItems() {
    if (get(this, 'isAuthenticated')) {
      get(this, 'userLocation.location').then(location => {
        get(this, 'store').query('talk', {
          page: get(this, 'page'),
          location_id: get(location, 'id'),
          per_page: 4
        }).then(talkItems => {
          if (!get(this, 'isDestroyed')) {
            set(this, 'talkItems', talkItems);
          }
        });
      });
    } else {
      set(this, 'talkItems', []);
    }
  },

  getEvents() {
    return get(this, 'userLocation.location').then(location => {
      return get(this, 'store').query('event', {
        page: get(this, 'page'),
        location_id: get(location, 'id'),
        per_page: 25,
        has_image: true
      }).then((events) => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'eventItems', events.reject((event) => {
            return isEmpty(get(event, 'startsAt')) || isEmpty(get(event, 'imageUrl'));
          }).slice(0, 4));
        }
      });
    });
  },

  getMarket() {
    return get(this, 'userLocation.location').then(location => {
      return get(this, 'store').query('market-post', {
        page: get(this, 'page'),
        location_id: get(location, 'id'),
        per_page: 25,
        has_image: true
      }).then((items) => {
        set(this, 'marketItems', items.reject((item) => {
          return isEmpty(get(item, 'imageUrl'));
        }).slice(0, 4));
      });
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.getEvents();
    this.getMarket();
    this.getTalkItems();
  }

});
