import Ember from 'ember';
import RoutesScrollToTopMixin from '../../../../mixins/routes/scroll-to-top';
import { module, test } from 'qunit';

module('RoutesScrollToTopMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesScrollToTopObject = Ember.Object.extend(RoutesScrollToTopMixin);
  var subject = RoutesScrollToTopObject.create();
  assert.ok(subject);
});
