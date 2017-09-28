import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import mockService from 'subtext-ui/tests/helpers/mock-service';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';
import Ember from 'ember';

/* global sinon */

const { RSVP: {Promise} } = Ember;

moduleForAcceptance('Acceptance | reset password');

test('filling out lost password request form', function(assert) {
  visit('/');
  click(testSelector('link', 'login-link'));

  click(testSelector('link', 'forgot-password')).then(()=> {
    assert.ok(find(testSelector('component', 'password-reset-request-form')).length, "forgot password request form visible");

    fillIn(testSelector('field', 'password-reset-request-form-email'), 'test@test.com');
    click(testSelector('password-reset-request-form-submit')).then(()=>{
      assert.ok(find(testSelector('password-reset-request-confirmation')).length,
        "Should see confirmation message after submitting form."
      );
    });

  });
});

test('filling out lost password request form with returnUrl query param', function(assert) {
  mockLocationCookie(this.application);

  let requestSpy = sinon.stub().returns(Ember.RSVP.Promise.resolve());
  let mockApi = Ember.Service.extend({
    requestPasswordReset: requestSpy,
    recordAdMetricEvent: function(){
      return true;
    },//outreach-cta component
    getWeather: function(){
      return Promise.resolve({});
    }, // used in template
    getFeatures() {
      return Promise.resolve({features:[]});
    }
  });
  mockService(this.application, 'api', mockApi);

  visit('/forgot-password?returnUrl=/test/url').then(()=> {
    assert.ok(find(testSelector('component', 'password-reset-request-form')).length, "forgot password request form visible");

    fillIn(testSelector('field', 'password-reset-request-form-email'), 'test@test.com');
    click(testSelector('password-reset-request-form-submit')).then(()=>{
      assert.ok(requestSpy.calledWith('test@test.com', '/test/url'), 'forwards return url to backend');
      assert.ok(find(testSelector('password-reset-request-confirmation')).length,
        "Should see confirmation message after submitting form."
      );
    });
  });
});

test('filling out lost password edit form', function(assert) {
  // Needs actual integration with mirage
  visit('/forgot-password/abc123').then(() => {
    assert.ok(find(testSelector('component', 'password-reset-form')).length,
      "Should see password reset form."
    );

    fillIn(testSelector('field', 'password-reset-form-password'), '123abc');
    fillIn(testSelector('field', 'password-reset-form-confirm-password'), '123abc');

    click(testSelector('password-reset-form-submit')).then(() => {
      assert.equal(currentURL(), '/sign_in',
          "After successful reset, redirects to sign in "
      );
    });
  });
});

test('filling out lost password edit form with return url', function(assert) {
  let redirectSpy = sinon.spy();
  let mockLocation = Ember.Service.extend({
    redirectTo: redirectSpy,
    referrer: function(){ return ''; },
    href: function() { return ''; },
    search: function() { return ''; },
    pathname: function() { return ''; },
    protocol: function() { return ''; }
  });

  mockService(this.application, 'windowLocation', mockLocation);

  // Needs actual integration with mirage
  visit('/forgot-password/abc123?return_url=/go/here').then(() => {
    assert.ok(find(testSelector('component', 'password-reset-form')).length,
      "Should see password reset form."
    );

    fillIn(testSelector('field', 'password-reset-form-password'), '123abc');
    fillIn(testSelector('field', 'password-reset-form-confirm-password'), '123abc');

    click(testSelector('password-reset-form-submit')).then(() => {
      assert.ok(redirectSpy.calledWith('/go/here'),
        "After successful reset, redirects to return url"
      );
    });
  });
});
