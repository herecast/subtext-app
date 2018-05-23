import { moduleFor, test } from 'ember-qunit';
/* global navigator */

moduleFor('service:media', 'Unit | Service | media', {
  // Specify the other units that are required for this test.
  // needs: ['service:media']
});

const nonMobileUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
const mobileUserAgent = "Mozilla/5.0 (Linux; Android 8.1.0; Nexus 5X Build/OPM4.171019.016.A1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36";
const nativeUserAgentAndroid = `${mobileUserAgent} subtext-android`;
const nativeUserAgentIOS = `${mobileUserAgent} subtext-ios`;

// Replace this with your real tests.
test('Non Mobile UserAgent triggers appropriate property change', function(assert) {
  navigator.__defineGetter__('userAgent', function() {
    return nonMobileUserAgent;
  });

  let service = this.subject();
  service.isMobile = false;

  assert.equal(service.get('isMobileButNotNative'), false);
});

test('Mobile UserAgent (not native) triggers appropriate property change', function(assert) {
  navigator.__defineGetter__('userAgent', function() {
    return mobileUserAgent;
  });

  let service = this.subject();
  service.isMobile = true;

  assert.equal(service.get('isMobileButNotNative'), true);
});

test('Mobile UserAgent on Native Android triggers appropriate property change', function(assert) {
  navigator.__defineGetter__('userAgent', function() {
    return nativeUserAgentAndroid;
  });

  let service = this.subject();
  service.isMobile = true;

  assert.equal(service.get('isMobileButNotNative'), false);
});

test('Mobile UserAgent on Native IOS triggers appropriate property change', function(assert) {
  navigator.__defineGetter__('userAgent', function() {
    return nativeUserAgentIOS;
  });

  let service = this.subject();
  service.isMobile = true;

  assert.equal(service.get('isMobileButNotNative'), false);
});
