import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import Ember from 'ember';
import mockService from 'subtext-ui/tests/helpers/mock-service';

moduleForAcceptance('Acceptance | lists/subscribe');

test('visiting /lists/:id/subscribe when already subscribed redirects to /lists/:id/manage', function(assert) {

  const token = 'abcdefg';
  server.create('subscription', {
    id: token,
    confirmedAt: '2014-10-13T00:00:00.000Z',
    unusbscribedAt: null
  });

  visit(`/lists/${token}/subscribe`)
  .then(function() {
    assert.equal(currentURL(), `/lists/${token}/manage`, 'it should redirect to /manage');
  });
});

test('visiting /lists/:id/subscribe when subscriber is not a dUV user and no active session', function(assert) {
  server.create('location'); //for registration form

  const notifications = [];
  mockService(this.application, 'notification-messages',
    Ember.Service.extend({
      info(msg) {
        notifications.push(msg);
      }
    })
  );

  let subscriptionWasConfirmed = false;
  server.patch("/subscriptions/:id/confirm", function() {
    subscriptionWasConfirmed = true;
  });

  invalidateSession(this.application);

  const subscription = server.create('subscription', {
    confirmedAt: null,
    unsubscribedAt: null,
    user: null,
    listserv: server.create('listserv')
  });


  visit(`/lists/${subscription.id}/subscribe`);

  andThen(function() {
    assert.ok(subscriptionWasConfirmed,
      "The subscription was confirmed on the api");

    assert.ok(find(testSelector('subscription-confirmation-message')).length,
      "Should see subscription confirmation message");

    assert.ok(find(testSelector('component', 'registration-form')).length,
      "Should see registration form");

    assert.equal(find(testSelector('field', 'registration-form-email')).val(), subscription.email,
      "Email is prefilled in registration form");

    // Register User
    fillIn(testSelector('field', 'registration-form-name'), "Joe Awesome");
    fillIn(testSelector('field', 'registration-form-password'), '123456789abc');
    const $locationSelect = find('select', testSelector('component', 'registration-form-location'));
    fillIn($locationSelect, find('option[value]:last', $locationSelect).val());
    click(testSelector('action', 'registration-form-submit'));

    andThen(() => {
      const notification = Ember.$(`<div>${notifications[0]}</div>`).text();
      assert.ok(notification.indexOf('Thanks for registering on dailyUV!') > -1,
        "After registering: Should display thank you notification");

      assert.equal(currentPath(), 'index.index',
        "After registering: Should be on home page");
    });

  });
});

test('visiting /lists/:id/subscribe existing user, not confirmed yet', function(assert) {
  const subscription = server.create('subscription', {
    confirmedAt: null,
    unsubscribedAt: null,
    listserv: server.create('listserv'),
    user: server.create('user')
  });

  let subscriptionWasConfirmed = false;
  server.patch("/subscriptions/:id/confirm", function() {
    subscriptionWasConfirmed = true;
  });

  visit(`/lists/${subscription.id}/subscribe`);

  andThen(function() {
    assert.ok(subscriptionWasConfirmed,
      "The subscription was confirmed on the api");

    assert.ok(find(testSelector('subscription-confirmation-message')).length,
      "Should see subscription confirmation message");

    assert.notOk(find(testSelector('component', 'registration-form')).length,
      "Should not see registration form");
  });
});
