import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global Ember, sinon */

moduleForComponent('directory-business-info', 'Integration | Component | directory business info', {
  integration: true,
  beforeEach() {
    const { stub, spy } = sinon;

    const instance = {
      fitBounds: spy(),
      setCenter: spy(),
    };

    const googleMaps = { googleMaps: {
        maps: {
          Map: stub().returns(instance),
          MapTypeId:  { ROADMAP: 'roadmap' },
          InfoWindow: spy(),
          Marker: stub().returns({ addListener() {}, setMap() {} }),
          LatLng: spy(),
          LatLngBounds: stub().returns({
            extend: stub(),
            getNorthEast: stub().returns({ lat() { }, lng() { }, })
          })
        }
      }
    };

    const google = Ember.Service.extend(googleMaps);

    this.register('service:google-maps', google);
    this.inject.service('google-maps', { as: 'google-maps' });
  }
});

test('it renders', function(assert) {

  const model = {
    details: '<p></p>'
  };

  this.set('model', model);

  this.render(hbs`{{directory-business-info model=model}}`);
  assert.ok(this.$());

});
