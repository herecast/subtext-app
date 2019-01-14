import EmberObject from '@ember/object';
import ComponentsJobsFormsMixin from 'subtext-ui/mixins/components/jobs-forms';
import { module, test } from 'qunit';

module('Unit | Mixin | components/jobs-forms', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ComponentsJobsFormsObject = EmberObject.extend(ComponentsJobsFormsMixin);
    let subject = ComponentsJobsFormsObject.create();
    assert.ok(subject);
  });
});
