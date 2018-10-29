import EmberObject from '@ember/object';
import RoutesResetScrollMixin from 'subtext-ui/mixins/routes/reset-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/reset scroll', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let RoutesResetScrollObject = EmberObject.extend(RoutesResetScrollMixin);
    let subject = RoutesResetScrollObject.create();
    assert.ok(subject);
  });
});
