import Ember from 'ember';
import RoutesBaseUserLocationMixin from 'subtext-ui/mixins/routes/base-user-location';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/base user location');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesBaseUserLocationObject = Ember.Object.extend(RoutesBaseUserLocationMixin);
  let subject = RoutesBaseUserLocationObject.create();
  assert.ok(subject);
});
