import EmberObject from '@ember/object';
import RoutesDetailRouteMixin from 'subtext-app/mixins/routes/detail-route';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/detail-route', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let RoutesDetailRouteObject = EmberObject.extend(RoutesDetailRouteMixin);
    let subject = RoutesDetailRouteObject.create();
    assert.ok(subject);
  });
});
