import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | biz/show');

test('visiting /biz/:id works', function(assert) {
  const organization = server.create('organization');
  server.create('business-profile', {
    organizationId: organization.id
  });
  server.createList('organization-content', 10);

  visit(`/biz/${organization.id}`);

  andThen(function() {
    assert.equal(currentURL(), `/biz/${organization.id}`);
  });
});

test('visiting /biz/:id as a non-signed in user shows only public contents', function(assert) {
  invalidateSession(this.application);

  const organization = server.create('organization');
  server.create('business-profile', {
    organizationId: organization.id
  });

  server.createList('organization-content', 100);

  visit(`/biz/${organization.id}`);

  andThen(function() {
    assert.equal(find(testSelector('biz-feed-card', 'private')).length, 0);
    assert.equal(find(testSelector('biz-feed-card', 'draft')).length, 0);
  });
});

test('visiting /biz/:id as a signed in manager of the organization shows public, private, and draft contents', function(assert) {
  const organization = server.create('organization');
  server.create('business-profile', {
    organizationId: organization.id
  });

  server.create('organization-content', {bizFeedPublic: true, publishedAt: '2017-06-25T14:23:43-04:00'});
  server.create('organization-content', {bizFeedPublic: false, publishedAt: '2017-06-25T14:23:43-04:00', sunsetDate: null});
  server.create('organization-content', {bizFeedPublic: null, publishedAt: null});

  const currentUser = server.create('current-user');
  currentUser.managedOrganizationIds = [`${organization.id}`];

  authenticateUser(this.application, server, currentUser);

  visit(`/biz/${organization.id}`);

  andThen(function() {
    assert.equal(find(testSelector('biz-feed-card', 'public')).length, 1, 'should show one public card on default view');

    click(find(testSelector('biz-feed-tab', 'private')));
    andThen(function() {
      assert.equal(find(testSelector('biz-feed-card', 'private')).length, 1, 'should show one private card when click private');

      click(find(testSelector('biz-feed-tab', 'draft')));
      andThen(function() {
        assert.equal(find(testSelector('biz-feed-card', 'draft')).length, 1, 'should show one draft card when click drafts');
      });
    });
  });
});

test('visiting /biz/:id as a signed in manager of the organization shows edit buttons', function(assert) {
  const organization = server.create('organization');
  server.create('business-profile', {
    organizationId: organization.id
  });
  server.createList('organization-content', 10);

  const currentUser = server.create('current-user');
  currentUser.managedOrganizationIds = [`${organization.id}`];

  authenticateUser(this.application, server, currentUser);

  visit(`/biz/${organization.id}`);

  andThen(function() {
    assert.ok(find(testSelector('biz-feed-header-edit-button')).length > 0);
  });
});
