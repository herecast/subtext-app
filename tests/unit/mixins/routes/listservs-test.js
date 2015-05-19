import Ember from 'ember';
import RoutesListservsMixin from '../../../../mixins/routes/listservs';
import { module, test } from 'qunit';

module('RoutesListservsMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesListservsObject = Ember.Object.extend(RoutesListservsMixin);
  var subject = RoutesListservsObject.create();
  assert.ok(subject);
});
