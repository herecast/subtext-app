import Ember from 'ember';
import ControllersLocationMixin from 'subtext-ui/mixins/controllers/location';
import { module, test } from 'qunit';

module('Unit | Mixin | controllers/location');

// Replace this with your real tests.
test('it works', function(assert) {
  let ControllersLocationObject = Ember.Object.extend(ControllersLocationMixin);
  let subject = ControllersLocationObject.create();
  assert.ok(subject);
});
