import Ember from 'ember';
import RoutesEventFilterMixin from '../../../../mixins/routes/event-filter';
import { module, test } from 'qunit';

module('RoutesEventFilterMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesEventFilterObject = Ember.Object.extend(RoutesEventFilterMixin);
  var subject = RoutesEventFilterObject.create();
  assert.ok(subject);
});
