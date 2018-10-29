import { geoDistance } from '../../../helpers/geo-distance';
import { module, test } from 'qunit';

module('Unit | Helper | geo distance', function() {
  test('it works', function(assert) {
    let result = geoDistance([{lat: 1, lng: 1}, {lat: 2, lng: 2}]);
    assert.ok(result);
  });
});
