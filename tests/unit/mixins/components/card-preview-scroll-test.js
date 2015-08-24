import Ember from 'ember';
import ComponentsCardPreviewScrollMixin from '../../../../mixins/components/card-preview-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | components/card preview scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  var ComponentsCardPreviewScrollObject = Ember.Object.extend(ComponentsCardPreviewScrollMixin);
  var subject = ComponentsCardPreviewScrollObject.create();
  assert.ok(subject);
});
