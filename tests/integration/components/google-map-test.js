import Service from '@ember/service';
import { Promise } from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | google map', function(hooks) {
  setupRenderingTest(hooks);

  test('when initializing the google map', async function(assert) {
    const { stub, spy } = sinon;

    const centerLocation = {
      city: 'city',
      state: 'VT',
      latitude: 43.1,
      longitude: -80
    };

    const instance = {
      setCenter: spy()
    };

    const googleMapsResolved = {
      Map: stub().returns(instance),
      MapTypeId:  { ROADMAP: 'roadmap' },
      Marker: stub().returns({ addListener() {}, setMap() {} })
    };

    const googleMaps = {
      getGoogleMaps() {
        return Promise.resolve(googleMapsResolved);
      }
    };

    const google = Service.extend(googleMaps);

    this.owner.register('service:google-maps', google);
    this['google-maps'] = this.owner.lookup('service:google-maps');

    this.set('centerLocation', centerLocation);
    await render(hbs`{{google-map centerLocation=centerLocation}}`);

    // adjust assertions to include arguments
    assert.ok(googleMapsResolved.Map.calledOnce,        'it creates one Google Maps instance');
    assert.ok(googleMapsResolved.Marker.calledOnce,     'it creates a Marker for the location');
  });
});
