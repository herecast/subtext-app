import Ember from 'ember';
import RoutesIndexLocationMixin from 'subtext-ui/mixins/routes/index-location';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/index location');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesIndexLocationObject = Ember.Object.extend(RoutesIndexLocationMixin);
  let subject = RoutesIndexLocationObject.create();
  assert.ok(subject);
});
