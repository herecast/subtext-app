import EmberObject from '@ember/object';
import ComponentsTextSnippetMixin from 'subtext-app/mixins/components/text-snippet';
import { module, test } from 'qunit';

module('Unit | Mixin | components/text snippet', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let ComponentsTextSnippetObject = EmberObject.extend(ComponentsTextSnippetMixin);
    let subject = ComponentsTextSnippetObject.create();
    assert.ok(subject);
  });
});
