import EmberObject from '@ember/object';
import ControllersPaginatedFilterMixin from '../../../../mixins/controllers/paginated-filter';
import { module, test } from 'qunit';

module('Unit | Mixin | controllers/paginated filter', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var ControllersPaginatedFilterObject = EmberObject.extend(ControllersPaginatedFilterMixin);
    var subject = ControllersPaginatedFilterObject.create();
    assert.ok(subject);
  });
});
