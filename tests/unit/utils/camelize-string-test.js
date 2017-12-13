import camelizeString from 'subtext-ui/utils/camelize-string';
import { module, test } from 'qunit';

module('Unit | Utility | camelize string');

// Replace this with your real tests.
test('camelizes expected model name variations', function(assert) {
  const stringShouldBe = 'feedContent';

  const stringsToCamelize = ['feed_content', 'feed-content', 'feedContent', 'feed content'];

  stringsToCamelize.forEach((stringToCamelize) => {
      assert.equal(camelizeString(stringToCamelize), stringShouldBe, `Should camelize string ${stringToCamelize}`);
  });
});
