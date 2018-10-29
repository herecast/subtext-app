import EmberObject from '@ember/object';
import RoutesPaginatedFilterMixin from '../../../../mixins/routes/paginated-filter';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/paginated filter', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var RoutesPaginatedFilterObject = EmberObject.extend(RoutesPaginatedFilterMixin);
    var subject = RoutesPaginatedFilterObject.create();
    assert.ok(subject);
  });
});
