import Ember from 'ember';
import ComponentsScrollMaintainerMixin from '../../../../mixins/components/scroll-maintainer';
import { module, test } from 'qunit';

module('Unit | Mixin | components/scroll maintainer');

// Replace this with your real tests.
test('it works', function(assert) {
  var ComponentsScrollMaintainerObject = Ember.Object.extend(ComponentsScrollMaintainerMixin);
  var subject = ComponentsScrollMaintainerObject.create();
  assert.ok(subject);
});
