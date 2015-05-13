import Ember from 'ember';
import ModelsBaseEventMixin from '../../../../mixins/models/base-event';
import { module, test } from 'qunit';

module('ModelsBaseEventMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ModelsBaseEventObject = Ember.Object.extend(ModelsBaseEventMixin);
  var subject = ModelsBaseEventObject.create();
  assert.ok(subject);
});
