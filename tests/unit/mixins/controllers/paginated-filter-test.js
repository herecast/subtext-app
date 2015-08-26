import Ember from 'ember';
import ControllersPaginatedFilterMixin from '../../../../mixins/controllers/paginated-filter';
import { module, test } from 'qunit';

module('Unit | Mixin | controllers/paginated filter');

// Replace this with your real tests.
test('it works', function(assert) {
  var ControllersPaginatedFilterObject = Ember.Object.extend(ControllersPaginatedFilterMixin);
  var subject = ControllersPaginatedFilterObject.create();
  assert.ok(subject);
});
