import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Service | geolocation', function(hooks) {
  setupTest(hooks);

  test('returns filtered results if presented with filter', function(assert) {
    const done = assert.async();
    const { stub } = sinon;

    const address_results = [{
      "address_components": [{
        "long_name": "Manchester",
        "short_name": "Manchester",
        "types": ["locality", "political"]
      }, {
        "long_name": "Hillsborough County",
        "short_name": "Hillsborough County",
        "types": ["administrative_area_level_2", "political"]
      }, {
        "long_name": "New Hampshire",
        "short_name": "NH",
        "types": ["administrative_area_level_1", "political"]
      }, {
        "long_name": "United States",
        "short_name": "US",
        "types": ["country", "political"]
      }],
      "formatted_address": "Manchester, NH, USA",
      "geometry": {
        "location": {
          lat() {return 35.4817431;},
          lng() {return 35.4817431;}
        }
      },
      "types": ["locality", "political"]
    }, {
      "address_components": [{
        "long_name": "Manchester",
        "short_name": "Manchester",
        "types": ["locality", "political"]
      }, {
        "long_name": "Manchester",
        "short_name": "Manchester",
        "types": ["administrative_area_level_3", "political"]
      }, {
        "long_name": "Hartford County",
        "short_name": "Hartford County",
        "types": ["administrative_area_level_2", "political"]
      }, {
        "long_name": "Connecticut",
        "short_name": "CT",
        "types": ["administrative_area_level_1", "political"]
      }, {
        "long_name": "United States",
        "short_name": "US",
        "types": ["country", "political"]
      }],
      "formatted_address": "Manchester, CT, USA",
      "geometry": {
        "location": {
          lat() {return 35.4817431;},
          lng() {return 35.4817431;}
        }
      },
      "types": ["locality", "political"]
    }, {
      "address_components": [{
        "long_name": "Manchester",
        "short_name": "Manchester",
        "types": ["locality", "political"]
      }, {
        "long_name": "Coffee County",
        "short_name": "Coffee County",
        "types": ["administrative_area_level_2", "political"]
      }, {
        "long_name": "Tennessee",
        "short_name": "TN",
        "types": ["administrative_area_level_1", "political"]
      }, {
        "long_name": "United States",
        "short_name": "US",
        "types": ["country", "political"]
      }, {
        "long_name": "37355",
        "short_name": "37355",
        "types": ["postal_code"]
      }],
      "formatted_address": "Manchester, TN 37355, USA",
      "geometry": {
        "location": {
          lat() {return 35.4817431;},
          lng() {return 35.4817431;}
        }
      },
      "types": ["locality", "political"]
    }];

    const googleMapsMock = {
      geocode: stub().yields(address_results, 'OK'),
      cityStateFormat: stub().returnsArg(0)
    };

    const googleMapsService = Service.extend(googleMapsMock);

    this.owner.register('service:google-maps', googleMapsService);
    this['google-maps'] = this.owner.lookup('service:google-maps');


    let service = this.owner.lookup('service:geolocation');

    let filterType = 'administrative_area_level_1';
    let filters = ['NH', 'VT'];
    let query = "Manchester";

    let request = service.geocode(query, {
        filterType: filterType,
        filterArray: filters
      });

    request.then((results) => {
      assert.ok(googleMapsMock.geocode.calledOnce, 'called geocode method only once');
      assert.ok(results.length === 1, 'should only return one result from mock set');
      assert.ok(results[0].human.formatted_address === 'Manchester, NH, USA', 'should only return Manchester, NH');
      done();
    });

  });
});
