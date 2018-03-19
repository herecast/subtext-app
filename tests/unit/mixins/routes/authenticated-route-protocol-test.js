import Ember from 'ember';
import RoutesAuthenticatedRouteProtocolMixin from 'subtext-ui/mixins/routes/authenticated-route-protocol';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/authenticated route protocol');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesAuthenticatedRouteProtocolObject = Ember.Object.extend(RoutesAuthenticatedRouteProtocolMixin);
  let subject = RoutesAuthenticatedRouteProtocolObject.create();
  assert.ok(subject);
});
