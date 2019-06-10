import EmberObject from '@ember/object';
import RoutesVariableInfinityModelParamsMixin from 'subtext-app/mixins/routes/variable-infinity-model-params';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/variable infinity model params', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let RoutesVariableInfinityModelParamsObject = EmberObject.extend(RoutesVariableInfinityModelParamsMixin);
    let subject = RoutesVariableInfinityModelParamsObject.create();
    assert.ok(subject);
  });
});
