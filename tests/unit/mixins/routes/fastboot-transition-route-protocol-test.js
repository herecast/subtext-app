import Ember from 'ember';
import RoutesFastbootTransitionRouteProtocolMixin from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/fastboot transtiion route protocol');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesFastbootTransitionRouteProtocolObject = Ember.Object.extend(RoutesFastbootTransitionRouteProtocolMixin);
  let subject = RoutesFastbootTransitionRouteProtocolObject.create();
  assert.ok(subject);
});
