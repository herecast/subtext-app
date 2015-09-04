import Ember from 'ember';
import RoutesHistoryMixin from '../../../../mixins/routes/history';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/history');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesHistoryObject = Ember.Object.extend(RoutesHistoryMixin);
  var subject = RoutesHistoryObject.create();
  assert.ok(subject);
});
