import Ember from 'ember';
import RoutesAuthorizedMixin from '../../../../mixins/routes/authorized';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/authorized');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesAuthorizedObject = Ember.Object.extend(RoutesAuthorizedMixin);
  var subject = RoutesAuthorizedObject.create();
  assert.ok(subject);
});
