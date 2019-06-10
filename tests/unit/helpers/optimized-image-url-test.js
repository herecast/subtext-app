import { optimizedImageUrl } from 'subtext-app/helpers/optimized-image-url';
import { module, test } from 'qunit';

module('Unit | Helper | optimized image url', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = optimizedImageUrl(['url', 10, 10, true]);
    assert.ok(result);
  });
});

