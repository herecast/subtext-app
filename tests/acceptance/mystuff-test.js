import { test } from 'qunit';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | mystuff', {
  beforeEach() {
    invalidateSession(this.application);
  }
});

test('Visiting /mystuff not signed in', function(assert) {
  visit('/mystuff');

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'user should be redirected to sign_in');
  });
});

test('Visiting /mystuff not signed in, then signing in', function(assert) {
  visit('/mystuff');

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'user should be redirected to sign_in');

    const user = server.create('current-user');

    fillIn(testSelector('field', 'sign-in-email'), user.email);
    fillIn(testSelector('field', 'sign-in-password'), 'password');

    click(testSelector('component', 'sign-in-submit'));

    andThen(function() {
      assert.equal(currentURL(), '/mystuff', 'user should be redirected to mystuff after logging in');
    });
  });
});

test('Visiting /mystuff - signed in, no content', function(assert) {
  authenticateUser(this.application);

  visit('/mystuff');

  andThen(()=>{
    assert.ok(
      find(testSelector('component', 'mystuff-contents-no-results')).length,
      "Should see no results card"
    );
  });
});

test('Visiting /mystuff - signed in, with content, content shows manage buttons', function(assert) {
  authenticateUser(this.application);

  const content = server.create('content', {
    authorId: 1
  });

  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/mystuff');

  andThen(()=>{
    assert.ok(
      find(testSelector('button', 'manage')).length,
      "Manage button should show on feed cards in myStuff"
    );
  });
});

test('Visiting /mystuff - signed in, with content, click on consolidated view and it works as expected', function(assert) {
  authenticateUser(this.application);

  const contentsForMystuff = server.createList('content', 5, {
    authorId: 1
  });

  let contentsIds = contentsForMystuff.map(content => content.id);

  const contentsForGeneral = server.createList('content', 5, {
    authorId: 2
  });

  let additionalIds = contentsForGeneral.map(content => content.id);

  const allIds = contentsIds.concat(additionalIds);

  allIds.forEach((id) => {
    server.create('feedItem', {
      modelType: 'content',
      contentId: id
    });
  });

  visit('/mystuff');

  andThen(()=>{
    assert.equal(find(testSelector('feed-card')).length, 5, "Only author specific feed cards show in mystuff");

    assert.ok(find(testSelector('button', 'condensed')).length, "Condensed button shows in mystuff");

    click(testSelector('button', 'condensed'));

    andThen(()=>{
      assert.equal(find(testSelector('condensed')).length, 5, "After condensed chosen, all feed cards show in condensed view");
    });
  });
});

test('Visiting /mystuff - signed in, with organization related content, organization filter works as expected for orgs', function(assert) {
  const done = assert.async();

  const org = server.create('organization', {
    id: 1
  });

  let user = server.create('currentUser', {
    managedOrganizations: [org]
  });

  authenticateUser(this.application, user);

  const contentsForMystuff = server.createList('content', 5, {
    authorId: 1,
    organizationId: org.id
  });

  let contentsIds = contentsForMystuff.map(content => content.id);

  contentsIds.forEach((id) => {
    server.create('feedItem', {
      modelType: 'content',
      contentId: id
    });
  });

  visit('/mystuff');

  andThen(()=>{
    assert.equal(find(testSelector('feed-card')).length, 5, "Authored cards show up in mystuff contents");

    assert.ok(find(testSelector('button', 'mystuff-organization-filter')).length, "Organization filter should show in mystuff if user has content owned by organization");

    click(testSelector('button', 'mystuff-organization-filter'));

    andThen(()=>{
      assert.ok(find(testSelector('button', 'mystuff-organization-choice')).length, "Filter options should show manage organizations in mystuff content filter");

      click(find(testSelector('button', 'mystuff-organization-choice'))[0]);

      server.get('/users/:id/contents', function(db, request) {
        assert.equal(request.queryParams.organization_id, org.id,
          `Api endpoint called with correct organization_id`
        );

        return db.feedItems.all();
      });

      andThen(()=>{
        const shouldBeInURL = `organizationId=${org.id}`;
        assert.ok(currentURL().indexOf(shouldBeInURL) >= 0, 'Should direct to proper organization filter in url');

        click(testSelector('action', 'remove-type-filter'));

        server.get('/users/:id/contents', function(db, request) {
          assert.equal(request.queryParams.organization_id, '',
            `Api endpoint called with correct organization_id`
          );
          done();

          return db.feedItems.all();
        });

        andThen(()=>{
          assert.equal(currentURL(), '/mystuff', 'Clearing organization filter should reset url params');
        });
      });
    });
  });
});

test('Visiting /mystuff - signed in, with organization related content, organization filter works as expected for personal', function(assert) {
  const org = server.create('organization', {
    id: 1
  });

  let user = server.create('currentUser', {
    managedOrganizations: [org]
  });

  authenticateUser(this.application, user);

  const contentsForMystuff = server.createList('content', 5, {
    authorId: 1,
    organizationId: org.id
  });

  let contentsIds = contentsForMystuff.map(content => content.id);

  contentsIds.forEach((id) => {
    server.create('feedItem', {
      modelType: 'content',
      contentId: id
    });
  });

  visit('/mystuff');

  andThen(()=>{
    assert.equal(find(testSelector('feed-card')).length, 5, "Authored cards show up in mystuff contents");

    assert.ok(find(testSelector('button', 'mystuff-organization-filter')).length, "Organization filter should show in mystuff if user has content owned by organization");

    click(testSelector('button', 'mystuff-organization-filter'));

    andThen(()=>{
      assert.ok(find(testSelector('button', 'mystuff-organization-choice')).length, "Filter options should show manage organizations in mystuff content filter");

      click(testSelector('button', 'mystuff-organization-choice-personal'));

      andThen(()=>{
        const shouldBeInURL = `organizationId=false`;
        assert.ok(currentURL().indexOf(shouldBeInURL) >= 0, 'Should direct to proper organization filter in url for personal content');

        click(testSelector('action', 'remove-type-filter'));

        andThen(()=>{
          assert.equal(currentURL(), '/mystuff', 'Clearing organization filter should reset url params');
        });
      });
    });
  });
});

test('Visiting /mystuff - signed in, content type filter works as expected', function(assert) {
  let user = server.create('current-user', {
    id: 1
  });

  authenticateUser(this.application, user);

  const contentsForMystuff = server.createList('content', 5, {
    authorId: 1
  });

  let contentsIds = contentsForMystuff.map(content => content.id);

  contentsIds.forEach((id) => {
    server.create('feedItem', {
      modelType: 'content',
      contentId: id
    });
  });

  visit('/mystuff');

  andThen(()=>{
    assert.equal(find(testSelector('feed-card')).length, 5, "Authored cards show up in mystuff contents");

    assert.ok(find(testSelector('button', 'mystuff-content-type-filter')).length, "Content Type filter should show in mystuff");

    click(testSelector('button', 'mystuff-content-type-filter'));

    andThen(()=>{
      assert.ok(find(testSelector('button', 'mystuff-content-type-choice')).length, "Filter options should show conetnt types in mystuff content filter");

      click(find(testSelector('button', 'mystuff-content-type-choice'))[0]);

      andThen(()=>{
        const shouldBeInURL = `type`;
        assert.ok(currentURL().indexOf(shouldBeInURL) >= 0, 'Should direct to type filter in url');
      });
    });
  });
});

test('Visiting /mystuff - signed in, route navigation works as expected', function(assert) {
  const org = server.create('organization', {
    id: 1
  });

  const commentsForUser = server.createList('comment', 5, {
    userId: 1
  });

  let user = server.create('currentUser', {
    id: 1,
    comments: commentsForUser,
    managedOrganizations: [org]
  });

  authenticateUser(this.application, user);

  server.create('digest');

  visit('/mystuff');

  andThen(()=>{

    click(testSelector('button', 'Comments'));

    andThen(()=>{
      assert.equal(currentURL(), '/mystuff/comments', 'Clicking the comments nav button should change the route to comments');

      assert.equal(find(testSelector('content-comment')).length, 5, 'The users comments should be displayed after route change to comments');

      click(testSelector('button', 'Subscriptions'));

      andThen(()=>{
        assert.equal(currentURL(), '/mystuff/subscriptions', 'Clicking the subscriptions nav button should change the route to subscriptions');

        assert.ok(find(testSelector('subscription')).length, 'Subscriptions should show up on subscription route');

        click(testSelector('button', 'Account'));

        andThen(()=>{
          assert.equal(currentURL(), '/mystuff/account', 'Clicking the account nav button should change the route to account');

          assert.ok(find(testSelector('account-form')).length, 'Account form should show up on account route');

        });
      });
    });
  });
});
