import EmberObject from '@ember/object';
import ComponentsPromotionFormMixin from '../../../../mixins/components/promotion-form';
import { module, test } from 'qunit';

module('Unit | Mixin | components/promotion form', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let ComponentsPromotionFormObject = EmberObject.extend(ComponentsPromotionFormMixin);
    let subject = ComponentsPromotionFormObject.create();
    assert.ok(subject);
  });
});
