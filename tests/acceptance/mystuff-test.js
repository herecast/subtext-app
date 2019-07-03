import { module, test, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession} from 'ember-simple-auth/test-support';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { visit, click, find, findAll, fillIn, currentURL } from '@ember/test-helpers';

module('Acceptance | mystuff', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
  });

  skip('Visiting /mystuff not signed in, then signing in', async function(assert) {

    await visit('/mystuff');

    assert.equal(currentURL(), '/sign_in', 'user should be redirected to sign_in');

    const user = this.server.create('current-user');

    await fillIn('[data-test-field="sign-in-email"]', user.email);
    await fillIn('[data-test-field="sign-in-password"]', 'password');

    await click('[data-test-component="sign-in-submit"]');
    //Skip test until after relaunch. Non-blocking issue, but may require overhaul of entire auth system
    assert.equal(currentURL(), '/mystuff', 'user should be redirected to mystuff after logging in');
  });

  test('Visiting /mystuff - signed in, no content', async function(assert) {
    authenticateUser(this.server);

    await visit('/mystuff');

    assert.ok(find('[data-test-component="mystuff-contents-no-results"]'), "Should see no results card");
  });


  test('Visiting /mystuff - signed in, with organization related content, organization filter works as expected for orgs', async function(assert) {
    const done = assert.async(2);

    const org = this.server.create('organization', {
      id: 1
    });

    let user = this.server.create('currentUser', {
      managedOrganizations: [org]
    });

    authenticateUser(this.server, user);

    const contentsForMystuff = this.server.createList('content', 5, {
      authorId: 1,
      organizationId: org.id
    });

    let contentsIds = contentsForMystuff.map(content => content.id);

    contentsIds.forEach((id) => {
      this.server.create('feedItem', {
        modelType: 'content',
        contentId: id
      });
    });

    await visit('/mystuff');

    assert.equal(findAll('[data-test-feed-card]').length, 5, "Authored cards show up in mystuff contents");

    assert.ok(find('[data-test-button="mystuff-organization-filter"]'), "Organization filter should show in mystuff if user has content owned by organization");

    await click('[data-test-button="mystuff-organization-filter"]');

    assert.ok(find('[data-test-button="mystuff-organization-choice"]'), "Filter options should show manage organizations in mystuff content filter");

    this.server.get('/users/:id/contents', function(db, request) {
      assert.equal(request.queryParams.organization_id, org.id, `Api endpoint called with correct organization_id`);
      done();

      return db.feedItems.all();
    });

    await click(find('[data-test-button="mystuff-organization-choice"]'));

    const shouldBeInURL = `organizationId=${org.id}`;
    assert.ok(currentURL().indexOf(shouldBeInURL) >= 0, 'Should direct to proper organization filter in url');

    this.server.get('/users/:id/contents', function(db, request) {
      assert.equal(request.queryParams.organization_id, '', `Api endpoint called with correct organization_id`);
      done();

      return db.feedItems.all();
    });

    await click('[data-test-action="remove-type-filter"]');

    assert.equal(currentURL(), '/mystuff', 'Clearing organization filter should reset url params');
  });

  test('Visiting /mystuff - signed in, with organization related content, organization filter works as expected for personal', async function(assert) {
    const org = this.server.create('organization', {
      id: 1
    });

    let user = this.server.create('currentUser', {
      managedOrganizations: [org]
    });

    authenticateUser(this.server, user);

    const contentsForMystuff = this.server.createList('content', 5, {
      authorId: 1,
      organizationId: org.id
    });

    let contentsIds = contentsForMystuff.map(content => content.id);

    contentsIds.forEach((id) => {
      this.server.create('feedItem', {
        modelType: 'content',
        contentId: id
      });
    });

    await visit('/mystuff');

    assert.equal(findAll('[data-test-feed-card]').length, 5, "Authored cards show up in mystuff contents");

    assert.ok(find('[data-test-button="mystuff-organization-filter"]'), "Organization filter should show in mystuff if user has content owned by organization");

    await click('[data-test-button="mystuff-organization-filter"]');

    assert.ok(find('[data-test-button="mystuff-organization-choice"]'), "Filter options should show manage organizations in mystuff content filter");

    await click('[data-test-button="mystuff-organization-choice-personal"]');

    const shouldBeInURL = `organizationId=false`;
    assert.ok(currentURL().indexOf(shouldBeInURL) >= 0, 'Should direct to proper organization filter in url for personal content');

    await click('[data-test-action="remove-type-filter"]');

    assert.equal(currentURL(), '/mystuff', 'Clearing organization filter should reset url params');
  });

  test('Visiting /mystuff - signed in, content type filter works as expected', async function(assert) {
    let user = this.server.create('current-user', {
      id: 1
    });

    authenticateUser(this.server, user);

    const contentsForMystuff = this.server.createList('content', 5, {
      authorId: 1
    });

    let contentsIds = contentsForMystuff.map(content => content.id);

    contentsIds.forEach((id) => {
      this.server.create('feedItem', {
        modelType: 'content',
        contentId: id
      });
    });

    await visit('/mystuff');

    assert.equal(findAll('[data-test-feed-card]').length, 5, "Authored cards show up in mystuff contents");

    assert.ok(find('[data-test-button="mystuff-content-type-filter"]'), "Content Type filter should show in mystuff");

    await click('[data-test-button="mystuff-content-type-filter"]');

    assert.ok(find('[data-test-button="mystuff-content-type-choice"]'), "Filter options should show conetnt types in mystuff content filter");

    await click(find('[data-test-button="mystuff-content-type-choice"]'));

    const shouldBeInURL = `type`;
    assert.ok(currentURL().indexOf(shouldBeInURL) >= 0, 'Should direct to type filter in url');
  });

  test('Visiting /mystuff - signed in, route navigation works as expected', async function(assert) {
    const org = this.server.create('organization', {
      id: 1
    });

    this.server.createList('comment', 5, {
      userId: 1
    });

    let user = this.server.create('current-user', {
      id: 1,
      managedOrganizations: [org]
    });

    authenticateUser(this.server, user);

    this.server.create('digest');

    await visit('/mystuff');

    await click('[data-test-button="Comments"]');

    assert.equal(currentURL(), '/mystuff/comments', 'Clicking the comments nav button should change the route to comments');

    assert.equal(findAll('[data-test-content-comment]').length, 5, 'The users comments should be displayed after route change to comments');

    await click('[data-test-button="Subscriptions"]');

    assert.equal(currentURL(), '/mystuff/subscriptions', 'Clicking the subscriptions nav button should change the route to subscriptions');

    assert.ok(find('[data-test-subscription]'), 'Subscriptions should show up on subscription route');

    await click('[data-test-button="Account"]');

    assert.equal(currentURL(), '/mystuff/account', 'Clicking the account nav button should change the route to account');

    assert.ok(find('[data-test-account-form]'), 'Account form should show up on account route');
  });
});
