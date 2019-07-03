import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import { invalidateSession } from 'ember-simple-auth/test-support';
import { visit, click, find, currentRouteName } from '@ember/test-helpers';


module('Acceptance | all ugc jobs', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    loadPioneerFeed(false);
    mockLocationCookie(this.server);
  });

  const Page = {
    visitRoot() {
      return visit('/');
    },

    clickOrangeButton() {
      return click(
        '[data-test-button="open-job-tray"]'
      );
    },

    selectJob(jobName) {
      return click(
        '[data-test-ugc-job-link]' +
        `[data-test-link="${jobName}"]`
      );
    }
  };

  test('Link to market create', async function(assert) {
    assert.expect(1);
    authenticateUser(this.server);

    await Page.visitRoot();
    await Page.clickOrangeButton();
    await Page.selectJob('market');

    assert.ok(find('[data-test-jobs-form="market"]'), 'Should show the market jobs form');
  });

  test('Link to startablog with user logged in, but no blog yet', async function(assert) {
    assert.expect(1);
    const currentUser = this.server.create('current-user', {
      userId: 1,
      canPublishNews: false
    });
    authenticateUser(this.server, currentUser);

    await Page.visitRoot();
    await Page.clickOrangeButton();
    await Page.selectJob('startablog');

    assert.equal(currentRouteName(), 'startablog');
  });

  test('Link to startablog with user logged out', async function(assert) {
    assert.expect(1);

    await Page.visitRoot();
    await Page.clickOrangeButton();
    await Page.selectJob('startablog');

    assert.equal(currentRouteName(), 'startablog');
  });

  test('Link to news create', async function(assert) {
    assert.expect(1);
    const currentUser = this.server.create('current-user', {
      userId: 1,
      canPublishNews: true
    });
    authenticateUser(this.server, currentUser);

    await Page.visitRoot();
    await Page.clickOrangeButton();
    await Page.selectJob('news');

    assert.equal(currentRouteName(), 'news.new');
  });

  test('Link to events create', async function(assert) {
    assert.expect(1);
    authenticateUser(this.server);

    await Page.visitRoot();
    await Page.clickOrangeButton();
    await Page.selectJob('event');

    assert.ok(find('[data-test-jobs-form="event"]'), 'Should show the event jobs form');
  });
});
