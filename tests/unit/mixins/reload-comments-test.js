import EmberObject from '@ember/object';
import ReloadCommentsMixin from 'subtext-ui/mixins/reload-comments';
import { module, test } from 'qunit';

module('Unit | Mixin | reload comments', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let ReloadCommentsObject = EmberObject.extend(ReloadCommentsMixin);
    let subject = ReloadCommentsObject.create();
    assert.ok(subject);
  });
});
