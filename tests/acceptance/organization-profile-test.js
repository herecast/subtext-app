import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import moment from 'moment';
import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';

moduleForAcceptance('Acceptance | organization profile');

/*******************************************
 * Organization Info / About
 */

test('Displays organization info', function(assert) {
  assert.expect(3);

  const organization = server.create('organization', {
    logoUrl: 'http://placehold.it/200x200',
    name: 'Foo Blog',
    description: 'A blog about foo, and bar; and how they came to be.'
  });
  visit(`/organizations/${organization.id}`);

  andThen(function() {
    let element;

    // Logo/Image
    element = find(testSelector('organization-image'));
    assert.equal(
      element.attr('src'),
      makeOptimizedImageUrl(organization.logoUrl, 150, 150, true),
      "Organization Logo");

    // Name
    element = find(testSelector('organization-name'));
    assert.equal(
      element.text().trim(),
      organization.name,
      "Organization Name");

    // Description
    element = find(testSelector('organization-description'));
    assert.equal(
      element.html().trim(),
      organization.description.trim(),
      "Organization Description");
  });
});

test("About header only shows when description is present", function(assert) {
  assert.expect(2);

  let org1 = server.create('organization');
  let org2 = server.create('organization', {description: null});

  visit(`/organizations/${org1.id}`).then(()=> {
    let $aboutSection = find(testSelector('about-header'));
    assert.ok($aboutSection.length > 0);

    // Section does not show when no about info
    visit(`/organizations/${org2.id}`).then(()=> {
      $aboutSection = find(testSelector('about-header'));
      assert.notOk($aboutSection.length > 0);
    });
  });
});

test("About section html description is rendered by browser", function(assert) {
  assert.expect(2);

  let organization = server.create('organization', {
    description: "<b class='BoldText'>html content</b> <a class='MailToLink' href='mailto://you@example.org'>Click Me</a>"
  });

  visit(`/organizations/${organization.id}`).then(()=> {
    let $aboutSection = find(testSelector('organization-description'));
    assert.ok(find('b.BoldText', $aboutSection).length > 0);
    assert.equal(find('a.MailToLink').attr('href'), 'mailto://you@example.org');
  });
});

/******************************************
 * Featured Content
 */

test('Given an organization with 3 news items; The newest 1 displays in the featured area.', function(assert) {
  assert.expect(4);

  let organization = server.create('organization');
  let news = [];

  news.push(server.create('news', {
    organizationId: organization.id,
    publishedAt: moment().subtract(1, 'days').format()
  }));
  news.push(server.create('news', {
    organizationId: organization.id,
    publishedAt: moment().subtract(2, 'days').format()
  }));
  news.push(server.create('news', {
    organizationId: organization.id,
    publishedAt: moment().subtract(3, 'days').format()
  }));

  visit(`/organizations/${organization.id}`);

  andThen(() => {
    let $featuredContent = find(testSelector('featured-content'));
    assert.equal($featuredContent.length, 1);

    assert.equal(
      find(testSelector('featured-content', news[0].id)).length,
      1,
      "First item is featured");

    assert.equal(
      find(testSelector('featured-content', news[1].id)).length,
      0,
      "Second item is not featured");

    assert.equal(
      find(testSelector('featured-content', news[2].id)).length,
      0,
      "Third item is not featured");
  });
});

test('Pagination, featured content is not display on subsequent pages', function(assert) {
  assert.expect(10);

  let organization = server.create('organization');
  let news = server.createList('news', 10, {organizationId: organization.id});
  let firstPage = news.slice(0, 8);
  let nextPage = news.slice(9);

  visit(`/organizations/${organization.id}`);

  andThen(()=> {
    click(testSelector('pagination-next')).then(()=> {
      let $featuredContent = find(testSelector('featured-content'));
      assert.equal($featuredContent.length, 0, "Featured content is gone");

      firstPage.forEach((item)=> {
        assert.equal(find(testSelector('news-card', item.title)).length, 0, "First page news item not in list");
      });
      nextPage.forEach((item)=> {
        assert.equal(find(testSelector('news-card', item.title)).length, 1, "Next page news item");
      });

    });
  });
});

/****************************
 * Other acceptance criteria
 */
test('Subscribe link, when subscribe url', function(assert) {
  assert.expect(2);

  let org1 = server.create('organization', {
    subscribeUrl: 'http://click.to/subscribe'
  });

  visit(`/organizations/${org1.id}`).then(()=> {
    let $subscribeLink = find(testSelector('link', 'organization-subscribe-link'));
    assert.equal($subscribeLink.attr('href'), org1.subscribeUrl);
  });

  let org2 = server.create('organization', {
    subscribeUrl: null
  });

  visit(`/organizations/${org2.id}`).then(()=> {
    let $subscribeLink = find(testSelector('link', 'organization-subscribe-link'));
    assert.equal($subscribeLink.length, 0);
  });
});

test('Visiting news landing page, clicking organization name brings me to profile page if organization.bizFeedActive is false', function(assert) {
  assert.expect(1);

  let organization = server.create('organization', {name: 'meta tauta', orgType: 'Blog', bizFeedActive: false});
  let location = server.create('location');
  server.create('news', {
    organizationId: organization.id,
    locationId: location.id,
    title: 'revelation'
  });

  visit(`/${location.id}/news`).then(()=> {
    let $newsCard = find(testSelector('news-card', 'revelation'));
    let $orgLink = find(testSelector('link', 'organization-link'), $newsCard);
    click($orgLink).then(()=> {
      assert.equal(currentURL(), `/organizations/${organization.id}-meta-tauta`);
    });
  });
});

test('Visiting news item page, clicking organization name brings me to profile page if organization.bizFeedActive is false', function(assert) {
  assert.expect(1);
  mockLocationCookie(this.application);

  let organization = server.create('organization', {name: 'meta tauta', orgType: 'Blog', bizFeedActive: false});
  let news = server.create('news', {
    organizationId: organization.id,
    title: 'revelation'
  });

  visit('/');

  andThen(() => {
    visit(`/news/${news.id}`).then(()=> {
      let $orgLink = find(testSelector('link', 'organization-link'));
      click($orgLink).then(()=> {
        assert.equal(currentURL(), `/organizations/${organization.id}-meta-tauta`);
      });
    });
  });
});
