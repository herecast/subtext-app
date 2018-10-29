import EmberObject from '@ember/object';
import RoutesRedirectAfterLoginMixin from '../../../../mixins/routes/redirect-after-login';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/redirect after login', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var RoutesRedirectAfterLoginObject = EmberObject.extend(RoutesRedirectAfterLoginMixin);
    var subject = RoutesRedirectAfterLoginObject.create();
    assert.ok(subject);
  });
});
