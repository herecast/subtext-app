import Ember from 'ember';
import RoutesTrackPageviewMixin from '../../../../mixins/routes/track-pageview';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/track pageview');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesTrackPageviewObject = Ember.Object.extend(RoutesTrackPageviewMixin);
  var subject = RoutesTrackPageviewObject.create();
  assert.ok(subject);
});
