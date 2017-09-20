// global window
import Ember from 'ember';

const {
  inject,
  get,
  set,
  setProperties
} = Ember;

export default Ember.Service.extend({
  routing: inject.service('-routing'),
  userLocation: inject.service('user-location'),
  query: "",
  isLoading: false,
  searchActive: false,

  performSearch(query) {
    setProperties(this, {
      isLoading: true,
      query: query
    });

    get(this, 'userLocation.location').then((userLocation) => {
      Ember.$(window).scrollTop(0,0);
      get(this, 'routing').transitionTo('location.index',
        [get(userLocation, 'id')],
        {query: query}
      ).finally(() => {
        set(this, 'isLoading', false);
      });
    });
  },

  clearSearch() {
    this.performSearch("");
  }
});
