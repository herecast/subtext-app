
import { showEventsAd } from 'subtext-ui/helpers/show-events-ad';
import { module, test } from 'qunit';

module('Unit | Helper | show events ad');


test('shows after 4th event', function(assert) {
  let result = showEventsAd([3]);
  assert.ok(result);
});

test('shows after 12th event', function(assert) {
  let result = showEventsAd([11]);
  assert.ok(result);
});
