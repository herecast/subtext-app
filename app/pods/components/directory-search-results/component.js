import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryListings'],
  results: null,
  searchCoords: computed('lat', 'lng', function() {
    return {
      lat: get(this, 'lat'),
      lng: get(this, 'lng')
    };
  })
});
