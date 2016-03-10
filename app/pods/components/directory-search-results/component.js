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
  }),
  actions: {
    buildGaugeTitle(result) {
      return `Based on ${(result.get('feedback_num')) || 0} ratings`;
    }
  }
});
