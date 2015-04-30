import Ember from 'ember';
import ControllersEventFilterMixin from '../../../../mixins/controllers/event-filter';
import { module, test } from 'qunit';

module('ControllersEventFilterMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ControllersEventFilterObject = Ember.Object.extend(ControllersEventFilterMixin);
  var subject = ControllersEventFilterObject.create();
  assert.ok(subject);
});
