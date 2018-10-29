import EmberObject from '@ember/object';
import RoutesMaintainScrollMixin from 'subtext-ui/mixins/routes/maintain-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/maintain scroll', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let RoutesMaintainScrollObject = EmberObject.extend(RoutesMaintainScrollMixin);
    let subject = RoutesMaintainScrollObject.create();
    assert.ok(subject);
  });
});
