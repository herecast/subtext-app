import { isBlankOrEmptyHtmlTags } from '../../../helpers/is-blank-or-empty-html-tags';
import { module, test } from 'qunit';

module('Unit | Helper | content is full', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = isBlankOrEmptyHtmlTags(["<p>asdf</p>"]);
    assert.ok(result);
  });
});
