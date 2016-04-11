import Ember from 'ember';
import RoutesResetScrollMixin from 'subtext-ui/mixins/routes/reset-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/reset scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesResetScrollObject = Ember.Object.extend(RoutesResetScrollMixin);
  let subject = RoutesResetScrollObject.create();
  assert.ok(subject);
});
