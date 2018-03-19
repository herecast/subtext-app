import Ember from 'ember';
import RoutesVariableInfinityModelParamsMixin from 'subtext-ui/mixins/routes/variable-infinity-model-params';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/variable infinity model params');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesVariableInfinityModelParamsObject = Ember.Object.extend(RoutesVariableInfinityModelParamsMixin);
  let subject = RoutesVariableInfinityModelParamsObject.create();
  assert.ok(subject);
});
