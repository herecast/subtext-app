import Ember from 'ember';

export function geoDistance(params) {
  const lat1 = params[0].lat,
        lon1 = params[0].lng,
        lat2 = params[1].lat,
        lon2 = params[1].lng;


  const R = 6371; // km (change this constant to get miles)
  var dLat = (lat2-lat1) * Math.PI / 180;
  var dLon = (lon2-lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  // convert to miles
  return d / 1.60934;
}

export default Ember.Helper.helper(geoDistance);
