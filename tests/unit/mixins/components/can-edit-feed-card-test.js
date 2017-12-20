import Ember from 'ember';
import ComponentsCanEditFeedCardMixin from 'subtext-ui/mixins/components/can-edit-feed-card';
import { module, test } from 'qunit';

module('Unit | Mixin | components/can edit feed card');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentsCanEditFeedCardObject = Ember.Object.extend(ComponentsCanEditFeedCardMixin);
  let subject = ComponentsCanEditFeedCardObject.create();
  assert.ok(subject);
});
