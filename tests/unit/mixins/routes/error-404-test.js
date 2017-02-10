import Ember from 'ember';
import RoutesError404Mixin from 'subtext-ui/mixins/routes/error-404';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/error 404');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesError404Object = Ember.Object.extend(RoutesError404Mixin);
  let subject = RoutesError404Object.create();
  assert.ok(subject);
});
