
import { showFeedAd } from 'subtext-ui/helpers/show-feed-ad';
import { module, test } from 'qunit';

module('Unit | Helper | show feed ad', function() {
  test('it knows the correct starting position for display ads', function(assert) {
    assert.ok(showFeedAd([2]));
  });
});
