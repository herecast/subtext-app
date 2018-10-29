import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | media', function(hooks) {
  setupTest(hooks);

  const nonMobileUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
  const mobileUserAgent = "Mozilla/5.0 (Linux; Android 8.1.0; Nexus 5X Build/OPM4.171019.016.A1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36";
  const nativeUserAgentAndroid = `${mobileUserAgent} subtext-android`;
  const nativeUserAgentIOS = `${mobileUserAgent} subtext-ios`;

  test('Non Mobile UserAgent triggers appropriate property change', function(assert) {
    navigator.__defineGetter__('userAgent', function() {
      return nonMobileUserAgent;
    });

    let service = this.owner.lookup('service:media');
    service.set('isMobile', false);

    assert.equal(service.get('isMobileButNotNative'), false);
  });

  test('Mobile UserAgent (not native) triggers appropriate property change', function(assert) {
    navigator.__defineGetter__('userAgent', function() {
      return mobileUserAgent;
    });

    let service = this.owner.lookup('service:media');
    service.set('isMobile', true);

    assert.equal(service.get('isMobileButNotNative'), true);
  });

  test('Mobile UserAgent on Native Android triggers appropriate property change', function(assert) {
    navigator.__defineGetter__('userAgent', function() {
      return nativeUserAgentAndroid;
    });

    let service = this.owner.lookup('service:media');
    service.set('isMobile', true);

    assert.equal(service.get('isMobileButNotNative'), false);
  });

  test('Mobile UserAgent on Native IOS triggers appropriate property change', function(assert) {
    navigator.__defineGetter__('userAgent', function() {
      return nativeUserAgentIOS;
    });

    let service = this.owner.lookup('service:media');
    service.set('isMobile', true);

    assert.equal(service.get('isMobileButNotNative'), false);
  });
});
