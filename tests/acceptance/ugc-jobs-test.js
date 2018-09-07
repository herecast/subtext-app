import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import mockCookies from 'subtext-ui/tests/helpers/mock-cookies';

moduleForAcceptance('Acceptance | ugc jobs', {
  beforeEach() {
    // To remove the tooltip and allow jobs menu to be visible
    const location = server.create('location');
    mockCookies(this.application, {
      locationId: location.id,
      locationConfirmed: true
    });
  }
});

const Page = {
  visitRoot() {
    return visit('/');
  },

  clickOrangeButton() {
    return click(
      testSelector('button', 'open-job-tray')
    );
  },

  selectJob(jobName) {
    return click(
      testSelector('ugc-job-link') +
      testSelector('link', jobName)
    );
  }
};

test('Link to market create', function(assert) {
  authenticateUser(this.application);
  const job = 'market';

  Page.visitRoot();
  Page.clickOrangeButton();
  Page.selectJob(job);

  andThen(function() {
    assert.equal(currentPath(), 'market.new.details');
  });
});

test('Link to startablog with user logged in, but no blog yet', function(assert) {
  const currentUser = server.create('current-user', {
    userId: 1,
    canPublishNews: false
  });
  authenticateUser(this.application, currentUser);

  const job = 'startablog';

  Page.visitRoot();
  Page.clickOrangeButton();
  Page.selectJob(job);

  andThen(function() {
    assert.equal(currentPath(), 'startablog');
  });
});

test('Link to startablog with user logged out', function(assert) {
  const job = 'startablog';

  Page.visitRoot();
  Page.clickOrangeButton();
  Page.selectJob(job);

  andThen(function() {
    assert.equal(currentPath(), 'startablog');
  });
});

test('Link to news create', function(assert) {
  const currentUser = server.create('current-user', {
    userId: 1,
    canPublishNews: true
  });
  authenticateUser(this.application, currentUser);

  const job = 'news';

  Page.visitRoot();
  Page.clickOrangeButton();
  Page.selectJob(job);

  andThen(function() {
    assert.equal(currentPath(), 'news.new');
  });
});


  // TODO: This functionality still works - but the test is broken. Something is happening on the event data entry page.
test('Link to events create', function(assert) {
  authenticateUser(this.application);
  const job = 'events';

  Page.visitRoot();
  Page.clickOrangeButton();
  Page.selectJob(job);

  andThen(function() {
    assert.equal(currentPath(), 'events.new.details');
  });
});
