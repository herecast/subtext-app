import Ember from 'ember';
import SilentRegistrationMixin from 'subtext-ui/mixins/silent-registration';
import { module, test } from 'qunit';

module('Unit | Mixin | silent registration');

// Replace this with your real tests.
test('it works', function(assert) {
  let SilentRegistrationObject = Ember.Object.extend(SilentRegistrationMixin);
  let subject = SilentRegistrationObject.create();
  assert.ok(subject);
});
