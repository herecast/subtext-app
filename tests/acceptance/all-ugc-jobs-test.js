import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { invalidateSession} from 'ember-simple-auth/test-support';
import { visit, click, currentRouteName } from '@ember/test-helpers';


module('Acceptance | all ugc jobs', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
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

    assert.equal(currentRouteName(), 'market.new.details');
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
    await Page.selectJob('events');

    assert.equal(currentRouteName(), 'events.new.details');
  });
});
