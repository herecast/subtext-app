import Ember from 'ember';
import ComponentsPromotionFormMixin from '../../../../mixins/components/promotion-form';
import { module, test } from 'qunit';

module('Unit | Mixin | components/promotion form');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentsPromotionFormObject = Ember.Object.extend(ComponentsPromotionFormMixin);
  let subject = ComponentsPromotionFormObject.create();
  assert.ok(subject);
});
