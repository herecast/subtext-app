import EmberObject from '@ember/object';
import ContentCommentsMixin from 'subtext-app/mixins/content-comments';
import { module, test } from 'qunit';

module('Unit | Mixin | content comments', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let ContentCommentsObject = EmberObject.extend(ContentCommentsMixin);
    let subject = ContentCommentsObject.create();
    assert.ok(subject);
  });
});
