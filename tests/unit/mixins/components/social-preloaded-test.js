import Ember from 'ember';
import ComponentsSocialPreloadedMixin from 'subtext-ui/mixins/components/social-preloaded';
import { module, test } from 'qunit';

module('Unit | Mixin | components/social preloaded');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentsSocialPreloadedObject = Ember.Object.extend(ComponentsSocialPreloadedMixin);
  let subject = ComponentsSocialPreloadedObject.create();
  assert.ok(subject);
});
