import Ember from 'ember';
import RoutesSocialTagsMixin from '../../../mixins/routes/social-tags';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/social tags');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesSocialTagsObject = Ember.Object.extend(RoutesSocialTagsMixin);
  var subject = RoutesSocialTagsObject.create();
  assert.ok(subject);
});
