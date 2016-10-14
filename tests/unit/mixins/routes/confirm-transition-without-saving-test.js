import Ember from 'ember';
import RoutesConfirmTransitionWithoutSavingMixin from 'subtext-ui/mixins/routes/confirm-transition-without-saving';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/confirm transition without saving');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesConfirmTransitionWithoutSavingObject = Ember.Object.extend(RoutesConfirmTransitionWithoutSavingMixin);
  let subject = RoutesConfirmTransitionWithoutSavingObject.create();
  assert.ok(subject);
});
