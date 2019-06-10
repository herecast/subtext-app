import EmberObject from '@ember/object';
import RoutesError404Mixin from 'subtext-app/mixins/routes/error-404';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/error 404', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let RoutesError404Object = EmberObject.extend(RoutesError404Mixin);
    let subject = RoutesError404Object.create();
    assert.ok(subject);
  });
});
