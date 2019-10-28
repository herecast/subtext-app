import EmberObject from '@ember/object';
import ControllersModalControllerMixin from 'subtext-app/mixins/controllers/modal-controller';
import { module, skip } from 'qunit';

module('Unit | Mixin | controllers/modal-controller', function() {
  // Replace this with your real tests.
  skip('it works', function (assert) {
    let ControllersModalControllerObject = EmberObject.extend(ControllersModalControllerMixin);
    let subject = ControllersModalControllerObject.create();
    assert.ok(subject);
  });
});
