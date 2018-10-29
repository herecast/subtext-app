import EmberObject from '@ember/object';
import ComponentsValidationMixin from '../../../../mixins/components/validation';
import { module, test } from 'qunit';

module('Unit | Mixin | components/validation', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var ComponentsValidationObject = EmberObject.extend(ComponentsValidationMixin);
    var subject = ComponentsValidationObject.create();
    assert.ok(subject);
  });
});
