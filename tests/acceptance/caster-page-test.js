import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { invalidateSession} from 'ember-simple-auth/test-support';
import { visit, find, findAll, currentURL } from '@ember/test-helpers';

module('Acceptance | caster page', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
  });


  test('Caster Page to anonymous user works as expected', async function(assert) {
    const caster = this.server.create('caster');
    const casterContents = this.server.createList('content', 5, { caster });

    let contentsIds = casterContents.map(content => content.id);

    contentsIds.forEach((id) => {
      this.server.create('feedItem', {
        modelType: 'content',
        contentId: id
      });
    });

    await visit(`/@${caster.handle}`);

    assert.equal(currentURL(), `/@${caster.handle}`, 'goes to correct caster page and does not redirect');

    assert.ok(find('[data-test-component="caster-header-card"]'), 'Should show the caster header card');

    assert.ok(find('[data-test-caster-tab="posts"].active'), 'posts tab should be active by default');
    assert.ok(find('[data-test-caster-tab="comments"]'), 'should show comments tab as an option');
    assert.ok(find('[data-test-caster-tab="about"]'), 'should show about tab as an option');
    assert.notOk(find('[data-test-caster-tab="liked"]'), 'should not show liked tab as an option');
    assert.notOk(find('[data-test-caster-tab="following"]'), 'should not show following tab as an option');
    assert.notOk(find('[data-test-caster-tab="hiding"]'), 'should not show hiding tab as an option');

    assert.equal(findAll('[data-test-feed-card]').length, casterContents.length, 'should show all the caster contents');
  });

  test('Caster Page to logged in user (but not own page) works as expected', async function(assert) {
    const currentUser = this.server.create('caster');
    authenticateUser(this.server, currentUser);

    const caster = this.server.create('caster');
    const casterContents = this.server.createList('content', 5, { caster });

    let contentsIds = casterContents.map(content => content.id);

    contentsIds.forEach((id) => {
      this.server.create('feedItem', {
        modelType: 'content',
        contentId: id
      });
    });

    await visit(`/@${caster.handle}`);

    assert.equal(currentURL(), `/@${caster.handle}`, 'goes to correct caster page and does not redirect');

    assert.ok(find('[data-test-component="caster-header-card"]'), 'Should show the caster header card');

    assert.ok(find('[data-test-caster-tab="posts"].active'), 'posts tab should be active by default');
    assert.ok(find('[data-test-caster-tab="comments"]'), 'should show comments tab as an option');
    assert.ok(find('[data-test-caster-tab="about"]'), 'should show about tab as an option');
    assert.notOk(find('[data-test-caster-tab="liked"]'), 'should not show liked tab as an option');
    assert.notOk(find('[data-test-caster-tab="following"]'), 'should not show following tab as an option');
    assert.notOk(find('[data-test-caster-tab="hiding"]'), 'should not show hiding tab as an option');

    assert.equal(findAll('[data-test-feed-card]').length, casterContents.length, 'should show all the caster contents');
  });

  test('Caster Page to logged in user and its their own page works as expected', async function(assert) {
    const currentUser = this.server.create('caster');
    authenticateUser(this.server, currentUser);

    const casterContents = this.server.createList('content', 5, {
      caster: currentUser
    });

    let contentsIds = casterContents.map(content => content.id);

    contentsIds.forEach((id) => {
      this.server.create('feedItem', {
        modelType: 'content',
        contentId: id
      });
    });

    await visit(`/@${currentUser.handle}`);

    assert.equal(currentURL(), `/@${currentUser.handle}`, 'goes to correct caster page and does not redirect');

    assert.ok(find('[data-test-component="caster-header-card"]'), 'Should show the caster header card');

    assert.ok(find('[data-test-caster-tab="posts"].active'), 'posts tab should be active by default');
    assert.ok(find('[data-test-caster-tab="comments"]'), 'should show comments tab as an option');
    assert.ok(find('[data-test-caster-tab="about"]'), 'should show about tab as an option');
    assert.ok(find('[data-test-caster-tab="liked"]'), 'should show liked tab as an option');
    assert.ok(find('[data-test-caster-tab="following"]'), 'should show following tab as an option');
    assert.ok(find('[data-test-caster-tab="hiding"]'), 'should show hiding tab as an option');

    assert.equal(findAll('[data-test-feed-card]').length, casterContents.length, 'should show all the caster contents');
  });

});
