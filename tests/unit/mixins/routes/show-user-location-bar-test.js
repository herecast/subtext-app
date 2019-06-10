import EmberObject from '@ember/object';
import RoutesShowUserLocationBarMixin from 'subtext-app/mixins/routes/show-user-location-bar';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/show user location bar', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let RoutesShowUserLocationBarObject = EmberObject.extend(RoutesShowUserLocationBarMixin);
    let subject = RoutesShowUserLocationBarObject.create();
    assert.ok(subject);
  });
});
