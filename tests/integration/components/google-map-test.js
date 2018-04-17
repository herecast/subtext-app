import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global Ember, sinon */

moduleForComponent('google-map', 'Integration | Component | google map', {
  integration: true
});

test('when initializing the google map', function(assert) {
  const { stub, spy } = sinon;

  const locations = [{
    coords: { lat: 40.000, lng: -80.000},
    title: 'first pin',
    content: 'some content'
  },{
    coords: { lat: 40.001, lng: -80.001 },
    title: 'second pin',
    content: 'more content'
  }];

  const instance = {
    fitBounds: spy(),
    setCenter: spy(),
  };

  const googleMapsResolved = {
    Map: stub().returns(instance),
    MapTypeId:  { ROADMAP: 'roadmap' },
    InfoWindow: spy(),
    Marker: stub().returns({ addListener() {}, setMap() {} }),
    LatLng: spy(),
    LatLngBounds: stub().returns({
      extend: stub(),
      getNorthEast: stub().returns({ lat() { }, lng() { }, })
    })
  };

  const googleMaps = {
    getGoogleMaps() {
      return Ember.RSVP.Promise.resolve(googleMapsResolved);
    }
  };

  const google = Ember.Service.extend(googleMaps);

  this.register('service:google-maps', google);
  this.inject.service('google-maps', { as: 'google-maps' });

  this.set('locations', locations);
  this.render(hbs`{{google-map locations=locations}}`);

  // adjust assertions to include arguments
  assert.ok(googleMapsResolved.Map.calledOnce,        'it creates one Google Maps instance');
  assert.ok(googleMapsResolved.InfoWindow.calledOnce, 'it creates one InfoWindow to share amongst all the markers');
  assert.ok(googleMapsResolved.Marker.calledTwice,    'it creates a Marker for each location');
  assert.ok(instance.fitBounds.calledOnce,    'it zooms the map to fit the Markers');
});
