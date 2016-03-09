import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Controller.extend({
  geo: inject.service('geolocation'),
  myCoords: computed.oneWay('geo.userLocation.coords'),
  fromSearch: window.location.href.indexOf('?') >= 0
});
