import EmberObject from '@ember/object';
import RoutesListservsMixin from '../../../../mixins/routes/listservs';
import { module, test } from 'qunit';

module('RoutesListservsMixin', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var RoutesListservsObject = EmberObject.extend(RoutesListservsMixin);
    var subject = RoutesListservsObject.create();
    assert.ok(subject);
  });
});
