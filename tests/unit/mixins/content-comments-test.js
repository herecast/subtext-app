import Ember from 'ember';
import ContentCommentsMixin from 'subtext-ui/mixins/content-comments';
import { module, test } from 'qunit';

module('Unit | Mixin | content comments');

// Replace this with your real tests.
test('it works', function(assert) {
  let ContentCommentsObject = Ember.Object.extend(ContentCommentsMixin);
  let subject = ContentCommentsObject.create();
  assert.ok(subject);
});
