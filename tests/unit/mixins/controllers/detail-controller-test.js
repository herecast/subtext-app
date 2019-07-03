import EmberObject from '@ember/object';
import ControllersDetailControllerMixin from 'subtext-app/mixins/controllers/detail-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | controllers/detail-controller', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ControllersDetailControllerObject = EmberObject.extend(ControllersDetailControllerMixin);
    let subject = ControllersDetailControllerObject.create();
    assert.ok(subject);
  });
});
