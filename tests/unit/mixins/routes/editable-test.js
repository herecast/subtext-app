import Ember from 'ember';
import RoutesEditableMixin from '../../../../mixins/routes/editable';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/editable');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesEditableObject = Ember.Object.extend(RoutesEditableMixin);
  let subject = RoutesEditableObject.create();
  assert.ok(subject);
});
