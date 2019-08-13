import { Promise } from 'rsvp';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { invalidateSession} from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import mockService from 'subtext-app/tests/helpers/mock-service';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import { visit, click, fillIn, find, currentURL } from '@ember/test-helpers';
import sinon from 'sinon';

module('Acceptance | reset password', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    loadPioneerFeed(false);
  });

  test('filling out lost password request form', async function(assert) {
    await visit('/');

    await click('[data-test-sidenav-from-header]');
    await click('[data-test-signin-from-side-menu]');
    
    await click('[data-test-link="forgot-password"]');

    assert.ok(find('[data-test-component="password-reset-request-form"]'), "forgot password request form visible");

    await fillIn('[data-test-field="password-reset-request-form-email"]', 'test@test.com');

    await click('[data-test-password-reset-request-form-submit]')

    assert.ok(find('[data-test-password-reset-request-confirmation]'), "Should see confirmation message after submitting form.");
  });

  test('filling out lost password request form with returnUrl query param', async function(assert) {
    mockLocationCookie(this.server);

    let requestSpy = sinon.stub().returns(Promise.resolve());
    let mockApi = {
      requestPasswordReset: requestSpy
    };
    mockService('api', mockApi);

    await visit('/forgot-password?returnUrl=/test/url');

    assert.ok(find('[data-test-component="password-reset-request-form"]'), "forgot password request form visible");

    await fillIn('[data-test-field="password-reset-request-form-email"]', 'test@test.com');

    await click('[data-test-password-reset-request-form-submit]');

    assert.ok(requestSpy.calledWith('test@test.com', '/test/url'), 'forwards return url to backend');
    assert.ok(find('[data-test-password-reset-request-confirmation]'), "Should see confirmation message after submitting form.");
  });

  test('filling out lost password edit form', async function(assert) {
    // Needs actual integration with mirage
    await visit('/forgot-password/abc123');

    assert.ok(find('[data-test-component="password-reset-form"]'), "Should see password reset form.");

    await fillIn('[data-test-field="password-reset-form-password"]', '123abc');
    await fillIn('[data-test-field="password-reset-form-confirm-password"]', '123abc');

    await click('[data-test-password-reset-form-submit]');

    assert.equal(currentURL(), '/sign_in',   "After successful reset, redirects to sign in");
  });

  test('filling out lost password edit form with return url', async function(assert) {
    let redirectSpy = sinon.spy();
    let mockLocation = {
      redirectTo: redirectSpy,
      referrer: function(){ return ''; },
      href: function() { return ''; },
      search: function() { return ''; },
      pathname: function() { return ''; },
      protocol: function() { return ''; }
    };

    mockService('windowLocation', mockLocation);

    // Needs actual integration with mirage
    await visit('/forgot-password/abc123?return_url=/go/here');

    assert.ok(find('[data-test-component="password-reset-form"]'),"Should see password reset form.");

    await fillIn('[data-test-field="password-reset-form-password"]', '123abc');
    await fillIn('[data-test-field="password-reset-form-confirm-password"]', '123abc');

    await click('[data-test-password-reset-form-submit]');

    assert.ok(redirectSpy.calledWith('/go/here'), "After successful reset, redirects to return url");
  });
});
