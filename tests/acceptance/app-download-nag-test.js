import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { invalidateSession} from 'ember-simple-auth/test-support';
import mockCookies from 'subtext-app/tests/helpers/mock-cookies';
import { visit, click, find, getContext } from '@ember/test-helpers';

module('Acceptance | app download nag', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    this.cookies = {};
    mockCookies(this.cookies);
  });

  test('Visiting homepage from Mobile Browser (not native app)', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: true
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('component', 'media', 'services:mediaMock');

    await visit('/');

    assert.ok(find('[data-test-nag-visible]'), 'Should show nag when visited from mobile device not in native app');

    await click('[data-test-action="close-nag"]');

    assert.notOk(find('[data-test-nag-visible]'), 'Should hide nag when close button clicked');
  });


  test('Visiting homepage from Mobile Browser (not native app) and Cookie present', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: true
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('component', 'media', 'services:mediaMock');

    this.cookies['hideAppDownloadNag'] = true;

    await visit('/');

    assert.notOk(find('[data-test-nag-visible]'), 'Should not show nag when visited from mobile device not in native app and cookie present');
  });

  test('Visiting homepage from Native App', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: false
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('component', 'media', 'services:mediaMock');

    await visit('/');

    assert.notOk(find('[data-test-nag-visible]'), 'Should not show nag when visited from native mobile app');
  });

  test('Visiting homepage from non mobile device', async function(assert) {
    const media = Service.extend({
      isMobileButNotNative: false
    });

    const { owner } = getContext();

    owner.register('services:mediaMock', media);
    owner.inject('component', 'media', 'services:mediaMock');

    await visit('/');

    assert.notOk(find('[data-test-nag-visible]'), 'Should not show nag when visited from non mobile device');
  });
});
