import Ember from 'ember';
import ComponentsTrackCardMixin from '../../../../mixins/components/track-card';
import { module, test } from 'qunit';

module('Unit | Mixin | components/track card');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentsTrackCardObject = Ember.Object.extend(ComponentsTrackCardMixin);
  let subject = ComponentsTrackCardObject.create();
  assert.ok(subject);
});
