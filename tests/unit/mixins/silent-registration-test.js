import EmberObject from '@ember/object';
import SilentRegistrationMixin from 'subtext-app/mixins/silent-registration';
import { module, test } from 'qunit';

module('Unit | Mixin | silent registration', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let SilentRegistrationObject = EmberObject.extend(SilentRegistrationMixin);
    let subject = SilentRegistrationObject.create();
    assert.ok(subject);
  });
});
