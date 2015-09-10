import Ember from 'ember';
import AdaptersQueryParamsMixin from '../../../../mixins/adapters/query-params';
import { module, test } from 'qunit';

module('Unit | Mixin | adapters/query params');

// Replace this with your real tests.
test('it works', function(assert) {
  var AdaptersQueryParamsObject = Ember.Object.extend(AdaptersQueryParamsMixin);
  var subject = AdaptersQueryParamsObject.create();
  assert.ok(subject);
});
