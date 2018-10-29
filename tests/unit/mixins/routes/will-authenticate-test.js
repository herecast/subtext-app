import EmberObject from '@ember/object';
import RoutesWillAuthenticateMixin from 'subtext-ui/mixins/routes/will-authenticate';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/will authenticate', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let RoutesWillAuthenticateObject = EmberObject.extend(RoutesWillAuthenticateMixin);
    let subject = RoutesWillAuthenticateObject.create();
    assert.ok(subject);
  });
});
