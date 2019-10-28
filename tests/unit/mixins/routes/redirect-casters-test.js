import EmberObject from '@ember/object';
import RoutesRedirectCastersMixin from 'subtext-app/mixins/routes/redirect-casters';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/redirect-casters', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let RoutesRedirectCastersObject = EmberObject.extend(RoutesRedirectCastersMixin);
    let subject = RoutesRedirectCastersObject.create();
    assert.ok(subject);
  });
});
