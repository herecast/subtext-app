import EmberObject from '@ember/object';
import RoutesScrollToTopMixin from '../../../../mixins/routes/scroll-to-top';
import { module, test } from 'qunit';

module('RoutesScrollToTopMixin', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var RoutesScrollToTopObject = EmberObject.extend(RoutesScrollToTopMixin);
    var subject = RoutesScrollToTopObject.create();
    assert.ok(subject);
  });
});
