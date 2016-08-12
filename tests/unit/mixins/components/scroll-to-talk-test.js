import Ember from 'ember';
import ComponentsScrollToTalkMixin from 'subtext-ui/mixins/components/scroll-to-talk';
import { module, test } from 'qunit';

module('Unit | Mixin | components/scroll to talk');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentsScrollToTalkObject = Ember.Object.extend(ComponentsScrollToTalkMixin);
  let subject = ComponentsScrollToTalkObject.create();
  assert.ok(subject);
});
