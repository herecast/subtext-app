import { test } from 'qunit';
import Mirage from 'ember-cli-mirage';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import startApp from 'subtext-ui/tests/helpers/start-app';
/* global Ember, sinon */

moduleForAcceptance('Acceptance | biz/show');

test('visiting /biz/:id works', function(assert) {
  const organization = server.create('organization');
  server.create('business-profile', {
    organization: organization,
    bizFeedActive: true
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
    organization: organization,
    bizFeedActive: true
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
    organization: organization,
    bizFeedActive: true
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


test('visiting /biz/:id for a business that does not have bizFeedActive redirects to directory', function(assert) {
  const application = startApp();
  const { stub } = sinon;

  const instance = {
    fitBounds: stub(),
    setCenter: stub(),
  };

  const googleMapsMock = Ember.Service.extend({
    googleMaps: {
      maps: {
        Map: stub().returns(instance),
        MapTypeId:  { ROADMAP: 'roadmap' },
        InfoWindow: stub(),
        Marker: stub().returns({ addListener() {}, setMap() {} }),
        LatLng: stub(),
        LatLngBounds: stub().returns({
          extend: stub(),
          getNorthEast: stub().returns({ lat() { }, lng() { }, })
        })
      }
    }
  });

  application.register('service:googleMapsMock', googleMapsMock);
  application.inject('component', 'googleMapsService', 'service:googleMapsMock');

  const organization = server.create('organization');
  const businessProfile = server.create('business-profile', {
    organization: organization,
    bizFeedActive: false
  });

  visit(`/biz/${organization.id}`);

  andThen(function() {
    const currentUrl = currentURL();
    let baseUrl = currentUrl.split('?')[0];

    assert.equal(baseUrl, `/directory/${businessProfile.id}`);
    Ember.run(application, 'destroy');
  });
});

test('search', function(assert) {
  const done = assert.async();

  const organization = server.create('organization');
  server.create('business-profile', {
    organization: organization,
    bizFeedActive: true
  });
  server.createList('organization-content', 10);

  server.get('/organizations/:id/contents', function({organizationContents}, request) {
    if(request.queryParams.query ==='test-query') {
      assert.ok(true, 'entering query requests queried data from API');
      done();
    }

    return organizationContents.all();
  });

  visit(`/biz/${organization.id}`);

  andThen(()=>{

    const $searchComponent = find(testSelector('component', 'organization-content-query'));

    fillIn(
      find('input', $searchComponent),
      'test-query'
    );
  });

  andThen(()=>{
    assert.equal(currentURL(), `/biz/${organization.id}?query=test-query`, 'Entering a query updates the url');
  });
});

/** TRACKING **/
test('Visiting a biz page fires off an impression event to the api', function(assert) {
  const organization = server.create("organization");
  server.create('businessProfile', {
    bizFeedActive: true,
    organization: organization
  });
  const done = assert.async();

  server.post('/metrics/profiles/:organization_id/impressions', function(db, request) {
    assert.equal(request.params.organization_id, organization.id);
    done();

    return new Mirage.Response(201, {}, {});
  });

  visit(`/biz/${organization.id}`);
});

test('Clicking a post on their page, results in a click tracking event sent to the api', function(assert) {
  const done = assert.async();
  const organization = server.create("organization");
  server.create('businessProfile', {
    bizFeedActive: true,
    organization: organization
  });
  const orgContent = server.create('organization-content', {
    publishedAt: (new Date()).toISOString(),
    contentType: 'news',
    bizFeedPublic: true,
    organization: organization
  });

  server.post('/metrics/profiles/:organization_id/clicks', function(db, request) {
    assert.equal(request.params.organization_id, organization.id,
      "Sends click event to api"
    );

    const data = JSON.parse(request.requestBody);

    assert.equal(data.content_id, orgContent.id,
      "The api post includes the content id that was clicked on"
    );

    done();

    return new Mirage.Response(201, {}, {});
  });

  visit(`/biz/${organization.id}`);

  andThen(() => {
    const card = find(testSelector('content', orgContent.id));
    const link = testSelector('link', 'biz-content-detail');

    click(
      link,
      card
    );
  });

});
