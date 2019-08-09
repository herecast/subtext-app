import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession} from 'ember-simple-auth/test-support';
import mockCookies from 'subtext-app/tests/helpers/mock-cookies';
import { visit, currentURL } from '@ember/test-helpers';

module('Acceptance | profile pages', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    mockCookies({});
  });

  test('Profile Page Loads', async function(assert) {
    const organization = this.server.create('organization');

    await visit(`/profile/${organization.id}`);

    assert.equal(currentURL(), `/profile/${organization.id}`, "Profile page displays");
  });

  test('Profile Page  -- Correct Org Detail Page Loads', async function(assert) {
    const organization = this.server.create('organization');

    const newsContent = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'news',
      organization: organization
    });

    await visit(`/profile/${organization.id}/${newsContent.id}`);

    assert.equal(currentURL(), `/profile/${organization.id}/${newsContent.id}`, "News detail page displays");

    const eventInstance = this.server.create('event-instance', {
      startsAt: "2018-01-30T21:19:17+00:00",
      endsAt: "2018-01-30T21:22:17+00:00"
    });

    const eventContent = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'event',
      organization: organization,
      startsAt: "2018-01-30T21:19:17+00:00",
      endsAt: "2018-01-30T21:22:17+00:00",

      eventInstances: [eventInstance]
    });

    await visit(`/profile/${organization.id}/${eventContent.id}/${eventInstance.id}`);

    assert.equal(currentURL(), `/profile/${organization.id}/${eventContent.id}/${eventInstance.id}`, "Event detail page displays");
  });

  test('Profile Page  -- Wrong Org Detail Page Redirects', async function(assert) {
    const correctOrganization = this.server.create('organization');
    const otherOrganization = this.server.create('organization');

    const newsContent = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'news',
      organization: correctOrganization
    });

    await visit(`/profile/${otherOrganization.id}/${newsContent.id}`);

    assert.equal(currentURL(), `/${newsContent.id}`, "Mismatched organization content owner and profile page redirects to feed with news content");

    const eventInstance = this.server.create('event-instance', {
      startsAt: "2018-01-30T21:19:17+00:00",
      endsAt: "2018-01-30T21:22:17+00:00"
    });

    const eventContent = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'event',
      organization: correctOrganization,
      startsAt: "2018-01-30T21:19:17+00:00",
      endsAt: "2018-01-30T21:22:17+00:00",
      eventInstances: [eventInstance]
    });

    await visit(`/profile/${otherOrganization.id}/${eventContent.id}/${eventInstance.id}`);

    assert.equal(currentURL(), `/${eventContent.id}/${eventInstance.id}`, "Mismatched organization content owner and profile page redirects to feed with event content");
  });

});
