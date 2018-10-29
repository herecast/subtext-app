import EmberObject from '@ember/object';
import ComponentsSocialPreloadedMixin from 'subtext-ui/mixins/components/social-preloaded';
import { module, test } from 'qunit';

module('Unit | Mixin | components/social preloaded', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let ComponentsSocialPreloadedObject = EmberObject.extend(ComponentsSocialPreloadedMixin);
    let subject = ComponentsSocialPreloadedObject.create();
    assert.ok(subject);
  });
});
