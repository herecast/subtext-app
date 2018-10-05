import Ember from 'ember';
import MystuffNavObjectsMixin from 'subtext-ui/mixins/mystuff-nav-objects';
import { module, test } from 'qunit';

module('Unit | Mixin | mystuff nav objects');

// Replace this with your real tests.
test('it works', function(assert) {
  let MystuffNavObjectsObject = Ember.Object.extend(MystuffNavObjectsMixin);
  let subject = MystuffNavObjectsObject.create();
  assert.ok(subject);
});
