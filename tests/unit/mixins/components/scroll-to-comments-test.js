import EmberObject from '@ember/object';
import ComponentsScrollToCommentsMixin from 'subtext-app/mixins/components/scroll-to-comments';
import { module, test } from 'qunit';

module('Unit | Mixin | components/scroll-to-comments', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ComponentsScrollToCommentsObject = EmberObject.extend(ComponentsScrollToCommentsMixin);
    let subject = ComponentsScrollToCommentsObject.create();
    assert.ok(subject);
  });
});
