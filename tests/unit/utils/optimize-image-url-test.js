import config from 'subtext-ui/config/environment';

import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';
import { module, test } from 'qunit';

let enableImageOptimization;

module('Unit | Utility | make optimized image url', function(hooks) {
  hooks.beforeEach(function() {
    // Enable image optimizations but revert back to prev config setting when testing is done
    enableImageOptimization = config['ENABLE_IMAGE_OPTIMIZATION'];
    config['ENABLE_IMAGE_OPTIMIZATION'] = true;
  });

  hooks.afterEach(function() {
    config['ENABLE_IMAGE_OPTIMIZATION'] = enableImageOptimization;
  });

  function isUrl(s) {
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
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
    assert.equal(makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', null, 100,  true), 'http://knotweed.s3.amazonaws.com');
    assert.equal(makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 100,  null, true), 'http://knotweed.s3.amazonaws.com');
  });

  test('it returns a URL', function(assert) {
    assert.equal(isUrl(makeOptimizedImageUrl('https://knotweed.s3.amazonaws.com', 100, 100, true )), true);
    assert.equal(isUrl(makeOptimizedImageUrl('https://knotweed.s3.amazonaws.com', 100, 100, false)), true);
  });

  test('it returns a new URL, different from the given URL', function(assert) {
    assert.notEqual(makeOptimizedImageUrl('https://knotweed.s3.amazonaws.com', 100, 100, true ), 'https://knotweed.s3.amazonaws.com');
    assert.notEqual(makeOptimizedImageUrl('https://knotweed.s3.amazonaws.com', 100, 100, false), 'https://knotweed.s3.amazonaws.com');
  });

  test('it accepts a variety of URLs', function(assert) {
    assert.equal(makeOptimizedImageUrl('https://foo.com', 100, 100, true ), 'https://foo.com');
    assert.equal(makeOptimizedImageUrl('http://foo.com', 100, 100, true ),  'http://foo.com');
    assert.equal(makeOptimizedImageUrl('https://foo.com/qweury/asdf', 100, 100, true ), 'https://foo.com/qweury/asdf');
    assert.equal(makeOptimizedImageUrl('https://foo.com/qweury/asdf/', 100, 100, true ), 'https://foo.com/qweury/asdf/');
    assert.equal(makeOptimizedImageUrl('https://foo.com/qweury/asdf?ss=33&tt=99', 100, 100, true ), 'https://foo.com/qweury/asdf?ss=33&tt=99');
    assert.equal(makeOptimizedImageUrl('https://foo.com/qweury/asdf/?ss=33&tt=99', 100, 100, true ), 'https://foo.com/qweury/asdf/?ss=33&tt=99');

    assert.notEqual(makeOptimizedImageUrl('https://knotweed.s3.amazonaws.com/asdf/wer?sd=33&tt=99', 100, 100, true ), 'https://knotweed.s3.amazonaws.com/asdf/wer?sd=33&tt=99');
    assert.ok(      makeOptimizedImageUrl('https://knotweed.s3.amazonaws.com/asdf/wer?sd=33&tt=99', 100, 100, true).match(/\/knotweed.s3.amazonaws.com\/asdf\/wer\?sd=33&tt=99/));
  });

  test('the returned URL depends on the cropping choice', function(assert) {
    assert.notEqual(makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 100, 100, true), makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 100, 100, false));
  });

  test('the returned URL depends on the target rectangle', function(assert) {
    assert.notEqual(makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 100, 100, true), makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 100, 200, true));
    assert.notEqual(makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 100, 100, true), makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 200, 100, true));
    assert.notEqual(makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 100, 200, true), makeOptimizedImageUrl('http://knotweed.s3.amazonaws.com', 200, 100, true));
  });

  test('it returns the given URL if the URL has an unknown hostname', function(assert) {
    assert.equal(   makeOptimizedImageUrl('https://unknown.hostname.com',      100, 100, true ), 'https://unknown.hostname.com');
    assert.notEqual(makeOptimizedImageUrl('https://knotweed.s3.amazonaws.com', 100, 100, true ), 'https://knotweed.s3.amazonaws.com');
  });
});
