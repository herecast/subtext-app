import Ember from 'ember';

const { set, inject, computed, get, isEmpty } = Ember;

export default Ember.Component.extend({
  session: inject.service(),
  store: inject.service(),
  newsItems: computed.alias('news'),

  talkItems: computed('page', 'session.isAuthenticated', function() {
    if(get(this, 'session.isAuthenticated')) {
      return get(this, 'store').query('talk', {
        page: get(this, 'page'),
        per_page: 6
      });
    } else {
      return [];
    }
  }),

  talkSort: ['publishedAt:desc'],

  sortedTalkItems: computed.sort('talkItems','talkSort'),

  hasTalkItems: computed.notEmpty('talkItems'),

  getEvents() {
    get(this, 'store').query('event', {
      page: get(this, 'page'),
      per_page: 25,
      has_image: true
    }).then((events) => {
      set(this, 'eventItems', events.reject((event) => {
        return isEmpty(get(event, 'startsAt')) || isEmpty(get(event, 'imageUrl'));
      }).slice(0,5));
    });
  },

  getMarket() {
    get(this, 'store').query('market-post', {
      page: get(this, 'page'),
      per_page: 25,
      has_image: true
    }).then((items) => {
      set(this, 'marketItems', items.reject((item) => {
        return isEmpty(get(item, 'imageUrl'));
      }).slice(0,5));
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.getEvents();
    this.getMarket();
  }

});
