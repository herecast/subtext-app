import Ember from 'ember';
import RoutesNavigationDisplayMixin from 'subtext-ui/mixins/routes/navigation-display';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/navigation display');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesNavigationDisplayObject = Ember.Object.extend(RoutesNavigationDisplayMixin);
  let subject = RoutesNavigationDisplayObject.create();
  assert.ok(subject);
});
