import Ember from 'ember';
import ComponentsTextSnippetMixin from 'subtext-ui/mixins/components/text-snippet';
import { module, test } from 'qunit';

module('Unit | Mixin | components/text snippet');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentsTextSnippetObject = Ember.Object.extend(ComponentsTextSnippetMixin);
  let subject = ComponentsTextSnippetObject.create();
  assert.ok(subject);
});
