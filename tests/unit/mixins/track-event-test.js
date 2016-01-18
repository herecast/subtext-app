import Ember from 'ember';
import TrackEventMixin from '../../../mixins/track-event';
import { module, test } from 'qunit';

module('Unit | Mixin | track event');

// Replace this with your real tests.
test('it works', function(assert) {
  let TrackEventObject = Ember.Object.extend(TrackEventMixin);
  let subject = TrackEventObject.create();
  assert.ok(subject);
});
