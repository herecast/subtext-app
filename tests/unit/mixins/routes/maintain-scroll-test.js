import Ember from 'ember';
import RoutesMaintainScrollMixin from 'subtext-ui/mixins/routes/maintain-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/maintain scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesMaintainScrollObject = Ember.Object.extend(RoutesMaintainScrollMixin);
  let subject = RoutesMaintainScrollObject.create();
  assert.ok(subject);
});
