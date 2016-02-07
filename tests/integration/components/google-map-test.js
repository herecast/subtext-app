import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global google, sinon */

moduleForComponent('google-map', 'Integration | Component | google map', {
  integration: true
});

test('it creates a google map', function(assert) {

  const locations = [{
    position: { lat: 40.000, lng: -80.000},
    title: 'first pin',
    content: 'some content'
  },{
    position: { lat: 40.001, lng: -80.001 },
    title: 'second pin',
    content: 'more content'
  }];

  google = {
    maps: {
      MapTypeId: { ROADMAP: 'roadmap' }
    }
  };

  google.maps.Map = sinon.spy();
  google.maps.LatLngBounds = sinon.stub().returns({ extend() {}, getNorthEast() {} });
  google.maps.InfoWindow = sinon.spy();
  google.maps.setCenter = sinon.spy();
  google.maps.Marker = sinon.stub().returns({ addListener() {}, setMap() {} });

  this.set('locations', locations);
  this.render(hbs`{{google-map locations=locations}}`);

  assert.ok(google.maps.Map.calledOnce,        'it creates one Google Maps instance');
  assert.ok(google.maps.InfoWindow.calledOnce, 'it creates one shared InfoWindow');
});
