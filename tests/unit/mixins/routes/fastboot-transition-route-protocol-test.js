import EmberObject from '@ember/object';
import RoutesFastbootTransitionRouteProtocolMixin from 'subtext-app/mixins/routes/fastboot-transition-route-protocol';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/fastboot transtiion route protocol', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let RoutesFastbootTransitionRouteProtocolObject = EmberObject.extend(RoutesFastbootTransitionRouteProtocolMixin);
    let subject = RoutesFastbootTransitionRouteProtocolObject.create();
    assert.ok(subject);
  });
});
