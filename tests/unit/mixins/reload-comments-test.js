import Ember from 'ember';
import ReloadCommentsMixin from 'subtext-ui/mixins/reload-comments';
import { module, test } from 'qunit';

module('Unit | Mixin | reload comments');

// Replace this with your real tests.
test('it works', function(assert) {
  let ReloadCommentsObject = Ember.Object.extend(ReloadCommentsMixin);
  let subject = ReloadCommentsObject.create();
  assert.ok(subject);
});
