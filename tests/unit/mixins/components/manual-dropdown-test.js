import Ember from 'ember';
import ComponentsManualDropdownMixin from '../../../../mixins/components/manual-dropdown';
import { module, test } from 'qunit';

module('ComponentsManualDropdownMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ComponentsManualDropdownObject = Ember.Object.extend(ComponentsManualDropdownMixin);
  var subject = ComponentsManualDropdownObject.create();
  assert.ok(subject);
});
