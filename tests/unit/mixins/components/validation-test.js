import Ember from 'ember';
import ComponentsValidationMixin from '../../../../mixins/components/validation';
import { module, test } from 'qunit';

module('Unit | Mixin | components/validation');

// Replace this with your real tests.
test('it works', function(assert) {
  var ComponentsValidationObject = Ember.Object.extend(ComponentsValidationMixin);
  var subject = ComponentsValidationObject.create();
  assert.ok(subject);
});
