import Ember from 'ember';
import RoutesShowUserLocationBarMixin from 'subtext-ui/mixins/routes/show-user-location-bar';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/show user location bar');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesShowUserLocationBarObject = Ember.Object.extend(RoutesShowUserLocationBarMixin);
  let subject = RoutesShowUserLocationBarObject.create();
  assert.ok(subject);
});
