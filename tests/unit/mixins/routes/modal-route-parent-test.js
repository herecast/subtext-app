import EmberObject from '@ember/object';
import RoutesModalRouteParentMixin from 'subtext-app/mixins/routes/modal-route-parent';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/modal-route-parent', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let RoutesModalRouteParentObject = EmberObject.extend(RoutesModalRouteParentMixin);
    let subject = RoutesModalRouteParentObject.create();
    assert.ok(subject);
  });
});
