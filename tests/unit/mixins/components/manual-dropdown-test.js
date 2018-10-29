import EmberObject from '@ember/object';
import ComponentsManualDropdownMixin from '../../../../mixins/components/manual-dropdown';
import { module, test } from 'qunit';

module('ComponentsManualDropdownMixin', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var ComponentsManualDropdownObject = EmberObject.extend(ComponentsManualDropdownMixin);
    var subject = ComponentsManualDropdownObject.create();
    assert.ok(subject);
  });
});
