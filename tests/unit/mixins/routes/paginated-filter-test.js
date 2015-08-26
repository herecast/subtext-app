import Ember from 'ember';
import RoutesPaginatedFilterMixin from '../../../../mixins/routes/paginated-filter';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/paginated filter');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesPaginatedFilterObject = Ember.Object.extend(RoutesPaginatedFilterMixin);
  var subject = RoutesPaginatedFilterObject.create();
  assert.ok(subject);
});
