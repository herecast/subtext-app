import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';
import { module, test } from 'qunit';

module('Unit | Utility | make optimized image url');

function isUrl(s) {
  var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}

test('it returns the given URL if the given URL is null or undefined', function(assert) {
  assert.equal(makeOptimizedImageUrl(null,      100, 100, true     ), null);
  assert.equal(makeOptimizedImageUrl(undefined, 100, 100, undefined), null);
});

test('it returns the given URL if the given URL is not an HTTP url', function(assert) {
  assert.equal(makeOptimizedImageUrl('non-http-url', 100, 100, true), 'non-http-url');
});

test('it returns the given URL if the given rectangle has no value', function(assert) {
  assert.equal(makeOptimizedImageUrl('http://url.com', null, 100,  true), 'http://url.com');
  assert.equal(makeOptimizedImageUrl('http://url.com', 100,  null, true), 'http://url.com');
});

test('it returns a URL', function(assert) {
  assert.equal(isUrl(makeOptimizedImageUrl('https://url.com', 100, 100, true )), true);
  assert.equal(isUrl(makeOptimizedImageUrl('https://url.com', 100, 100, false)), true);
});

test('it returns a new URL, different from the given URL', function(assert) {
  assert.notEqual(makeOptimizedImageUrl('https://url.com', 100, 100, true ), 'https://url.com');
  assert.notEqual(makeOptimizedImageUrl('https://url.com', 100, 100, false), 'https://url.com');
});

test('the returned URL depends on the cropping choice', function(assert) {
  assert.notEqual(makeOptimizedImageUrl('http://url.com', 100, 100, true), makeOptimizedImageUrl('http://url.com', 100, 100, false));
});

test('the returned URL depends on the target rectangle', function(assert) {
  assert.notEqual(makeOptimizedImageUrl('http://url.com', 100, 100, true), makeOptimizedImageUrl('http://url.com', 100, 200, true));
  assert.notEqual(makeOptimizedImageUrl('http://url.com', 100, 100, true), makeOptimizedImageUrl('http://url.com', 200, 100, true));
  assert.notEqual(makeOptimizedImageUrl('http://url.com', 100, 200, true), makeOptimizedImageUrl('http://url.com', 200, 100, true));
});
