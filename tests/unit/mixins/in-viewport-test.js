import Ember from 'ember';
import InViewportMixin from '../../../mixins/in-viewport';
import { module, test } from 'qunit';

module('Unit | Mixin | in viewport');

// Replace this with your real tests.
test('it works', function(assert) {
  let InViewportObject = Ember.Object.extend(InViewportMixin);
  let subject = InViewportObject.create();
  assert.ok(subject);
});
