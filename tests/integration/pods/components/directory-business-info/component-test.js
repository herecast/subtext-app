import Service from '@ember/service';
import { Promise } from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | directory business info', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    const { stub, spy } = sinon;

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
        return Promise.resolve(googleMapsResolved);
      }
    };

    const google = Service.extend(googleMaps);

    this.owner.register('service:google-maps', google);
    this['google-maps'] = this.owner.lookup('service:google-maps');
  });

  test('it renders', async function(assert) {

    const model = {
      details: '<p></p>'
    };

    this.set('model', model);

    await render(hbs`{{directory-business-info model=model}}`);
    assert.ok(this.element);

  });
});
