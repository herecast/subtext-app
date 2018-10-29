import EmberObject from '@ember/object';
import RoutesHistoryMixin from '../../../../mixins/routes/history';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/history', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var RoutesHistoryObject = EmberObject.extend(RoutesHistoryMixin);
    var subject = RoutesHistoryObject.create();
    assert.ok(subject);
  });
});
