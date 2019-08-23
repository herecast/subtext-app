import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { invalidateSession} from 'ember-simple-auth/test-support';
import mockCookies from 'subtext-app/tests/helpers/mock-cookies';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { visit, click, find, getContext } from '@ember/test-helpers';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';

module('Acceptance | app download nag', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    loadPioneerFeed(false);
    mockLocationCookie(this.server);
  });

  test('Visiting homepage from Mobile Browser (not native app in Android)', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: true,
      mobileOperatingSystem: 'android',
      isMobileAndroid: true
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('service:nags', 'media', 'services:mediaMock');
    owner.inject('component', 'media', 'services:mediaMock');

    await visit('/');

    assert.ok(find('[data-test-nag-visible]'), 'Should show nag when visited from android mobile device not in native app');
    assert.ok(find('a[href*="google"]'), 'Should have the google play link in the cta button');

    await click('[data-test-action="close-nag"]');

    assert.notOk(find('[data-test-nag-visible]'), 'Should hide nag when close button clicked');
  });

  test('Visiting homepage from Mobile Browser (not native app in IOS)', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: true,
      mobileOperatingSystem: 'ios',
      isMobileIOS: true
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('service:nags', 'media', 'services:mediaMock');
    owner.inject('component', 'media', 'services:mediaMock');

    await visit('/');

    assert.ok(find('[data-test-nag-visible]'), 'Should show nag when visited from ios mobile device not in native app');
    assert.ok(find('a[href*="apple"]'), 'Should have the apple store link in the cta button');

    await click('[data-test-action="close-nag"]');

    assert.notOk(find('[data-test-nag-visible]'), 'Should hide nag when close button clicked');
  });

  test('Visiting homepage from Mobile Browser (not native app in other than IOS or Android)', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: true,
      mobileOperatingSystem: 'windows'
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('service:nags', 'media', 'services:mediaMock');
    owner.inject('component', 'media', 'services:mediaMock');

    await visit('/');

    assert.notOk(find('[data-test-nag-visible]'), 'Should not show nag when visited from mobile device not in native app and not android or IOS');
  });


  test('Visiting homepage from Mobile Browser (not native app) and Cookie present', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: true,
      mobileOperatingSystem: 'ios',
      isMobileIOS: true
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('service:nags', 'media', 'services:mediaMock');
    owner.inject('component', 'media', 'services:mediaMock');

    this.cookies = {};
    this.cookies['hideAppDownloadNag'] = true;
    mockCookies(this.cookies);

    await visit('/');

    assert.notOk(find('[data-test-nag-visible]'), 'Should not show nag when visited from mobile device not in native app and cookie present');
  });

  test('Visiting homepage from Native App', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: false,
      mobileOperatingSystem: 'ios',
      isMobileIOS: true
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('service:nags', 'media', 'services:mediaMock');
    owner.inject('component', 'media', 'services:mediaMock');

    await visit('/');

    assert.notOk(find('[data-test-nag-visible]'), 'Should not show nag when visited from native mobile app');
  });

  test('Visiting homepage from non mobile device', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: false,
      mobileOperatingSystem: 'windows',
      isMobileIOS: false,
      isMobileAndroid: false
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('service:nags', 'media', 'services:mediaMock');
    owner.inject('component', 'media', 'services:mediaMock');

    await visit('/');

    assert.notOk(find('[data-test-nag-visible]'), 'Should not show nag when visited from non mobile device');
  });
});
