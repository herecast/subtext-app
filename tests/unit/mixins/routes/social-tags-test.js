import EmberObject from '@ember/object';
import RoutesSocialTagsMixin from '../../../../mixins/routes/social-tags';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/social tags', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var RoutesSocialTagsObject = EmberObject.extend(RoutesSocialTagsMixin);
    var subject = RoutesSocialTagsObject.create();
    assert.ok(subject);
  });
});
