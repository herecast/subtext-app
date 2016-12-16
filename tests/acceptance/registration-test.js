import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | registration');

const registrationPage = {
  visit() {
    return visit('/sign_up');
  }
};

const registrationMenuOrPage = {
  visit() {
    return visit('/');
  },

  open() {
    this.visit();
    return click(testSelector('link', 'join-link'));
  },

  location(location) {
    return fillIn(testSelector('field', 'location-dropdown'), location);
  },

  submit() {
    return click(testSelector('component', 'register-submit-button'));
  },

  element() {
    return find(testSelector('component', 'registration-form'));
  },

  name(name) {
    return fillIn(testSelector('field', 'register-name-input'), name);
  },

  email(email) {
    return fillIn(testSelector('field', 'register-email-input'), email);
  },

  password(password) {
    return fillIn(testSelector('field', 'register-password-input'), password);
  },

  acceptTerms() {
    return click(testSelector('field', 'register-terms'));
  }
};

test('clicking join link displays the registration form', function(assert) {
  registrationMenuOrPage.open();

  andThen(() => {
    assert.equal(registrationMenuOrPage.element().length, 1, 'registration form should be present');
  });
});

test('registration works', function(assert) {
  assert.expect(1);
  const locations = server.createList('location', 8);

  registrationMenuOrPage.open();

  registrationMenuOrPage.location(locations[0].id);
  registrationMenuOrPage.name('Marshall Mathers');
  registrationMenuOrPage.email('slim_shady@example.com');
  registrationMenuOrPage.password('willtherealslimshadypleasestandup1');
  registrationMenuOrPage.acceptTerms();

  registrationMenuOrPage.submit();

  andThen(function() {
    assert.equal(currentURL(), '/sign_up/complete', 'it should be at the confirmation page after registration');
  });
});

test('registration requires clicking I agree', function(assert) {
  assert.expect(1);

  const locations = server.createList('location', 8);
  visit('/');
  registrationMenuOrPage.open();

  registrationMenuOrPage.name('Marshall Mathers');
  registrationMenuOrPage.location(locations[0].id);
  registrationMenuOrPage.email('slim_shady@example.com');
  registrationMenuOrPage.password('willtherealslimshadypleasestandup1');

  registrationMenuOrPage.submit();

  andThen(function() {
    assert.notEqual(currentURL(), '/sign_up/complete', 'it should not redirect if user attempts to join without clicking I agree');
  });
});

test('visiting registration page while already authenticated redirects to root page', function(assert) {
  assert.expect(1);
  authenticateSession(this.application);

  registrationPage.visit();

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should redirect to the correct url when the user is already authenticated');
  });
});

test('registering through the global nav: it should subscribe the new user to selected digests', function(assert) {
  assert.expect(2);
  let asyncCallCount = 0;
  const done = assert.async();

  server.post('/subscriptions', (db, request) => {
    const requestBody = JSON.parse(request.requestBody);

    assert.ok(['1', '3'].contains(requestBody.subscription.listserv_id),
              `it posts a subscription for digest #${requestBody.subscription.listserv_id}`);

    asyncCallCount += 1;
    if (asyncCallCount === 2) {
      done();
    }
  });

  const locations = server.createList('location', 3);
  const listservs = server.createList('listserv', 3);
  listservs.forEach((listserv) => server.create('digest', {id: listserv.id}));

  registrationMenuOrPage.open();

  registrationMenuOrPage.location(locations[0].id);
  registrationMenuOrPage.name('Marshall Mathers');
  registrationMenuOrPage.email('slim_shady@example.com');
  registrationMenuOrPage.password('willtherealslimshadypleasestandup1');
  registrationMenuOrPage.acceptTerms();

  andThen(function() {
    click(find(testSelector('digest-subscribe-item'))[0]);
    click(find(testSelector('digest-subscribe-item'))[2]);

    click(testSelector('component', 'register-submit-button'));
  });

});

test('visiting protected page and then registering: it should subscribe the new user to selected digests', function(assert) {
  assert.expect(2);
  let asyncCallCount = 0;
  const done = assert.async();

  server.post('/subscriptions', (db, request) => {
    const requestBody = JSON.parse(request.requestBody);
    assert.ok(['1', '3'].contains(requestBody.subscription.listserv_id),
              `it posts a subscription for digest #${requestBody.subscription.listserv_id}`);

    asyncCallCount += 1;
    if (asyncCallCount === 2) {
      done();
    }
  });

  const locations = server.createList('location', 3);
  const listservs = server.createList('listserv', 3);
  listservs.forEach((listserv) => server.create('digest', {id: listserv.id}));

  visit('/talk');

  andThen(function() {
    click(find('.PillNavigation-item')[1]);

    andThen(function() {
      registrationMenuOrPage.location(locations[0].id);
      registrationMenuOrPage.name('Marshall Mathers');
      registrationMenuOrPage.email('slim_shady@example.com');
      registrationMenuOrPage.password('willtherealslimshadypleasestandup1');
      registrationMenuOrPage.acceptTerms();

      andThen(function() {
        click(find(testSelector('digest-subscribe-item'))[0]);
        click(find(testSelector('digest-subscribe-item'))[2]);

        click(testSelector('component', 'register-submit-button'));
      });
    });
  });
});
