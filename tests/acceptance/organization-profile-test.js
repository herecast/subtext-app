import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import moment from 'moment';

moduleForAcceptance('Acceptance | organization profile');

/*******************************************
 * Organization Info / About
 */

test('Displays organization info', function(assert) {
  assert.expect(4);

  const organization = server.create('organization', {
    logoUrl: 'http://placehold.it/200x200',
    name: 'Foo Blog',
    profileTitle: 'About Foo Blog inc.',
    description: 'A blog about foo, and bar; and how they came to be.'
  });
  visit(`/organizations/${organization.id}`);

  andThen(function() {
    let element;

    // Logo/Image
    element = find(testSelector('organization-image'));
    assert.equal(
      element.attr('src'),
      organization.logoUrl,
      "Organization Logo");

    // Name
    element = find(testSelector('organization-name'));
    assert.equal(
      element.text().trim(),
      organization.name,
      "Organization Name");

    // Title
    element = find(testSelector('organization-profile-title'));
    assert.equal(
      element.text().trim(),
      organization.profileTitle,
      "Organization Profile Title");

    // Description
    element = find(testSelector('organization-description'));
    assert.equal(
      element.html().trim(),
      organization.description.trim(),
      "Organization Description");
  });
});

test("About section only shows when image and/or description", function(assert) {
  assert.expect(2);

  let org1 = server.create('organization');
  let org2 = server.create('organization', {logoUrl: null, description: null});

  visit(`/organizations/${org1.id}`).then(()=> {
    let $aboutSection = find(testSelector('component', 'about-section'));
    assert.ok($aboutSection.length > 0);

    // Section does not show when no about info
    visit(`/organizations/${org2.id}`).then(()=> {
      $aboutSection = find(testSelector('component', 'about-section'));
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
    let $aboutSection = find(testSelector('component', 'about-section'));
    assert.ok(find('b.BoldText', $aboutSection).length > 0);
    assert.equal(find('a.MailToLink').attr('href'), 'mailto://you@example.org');
  });
});

/******************************************
 * Featured Content
 */

test('Given an organization with 3 news items; The newest 2 display in the featured area.', function(assert) {
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
    assert.equal($featuredContent.length, 2);

    assert.equal(
      find(testSelector('featured-content', news[0].id)).length,
      1,
      "First item is featured");

    assert.equal(
      find(testSelector('featured-content', news[1].id)).length,
      1,
      "Second item is featured");

    assert.equal(
      find(testSelector('featured-content', news[2].id)).length,
      0,
      "Third item is not featured");
  });
});

/******************************************
 * More Content
 */

test("More Content not visible unless there is content to show there", function(assert) {
  assert.expect(2);

  let organization = server.create('organization');

  // Create content for featured area, but not enough for 'more content'
  for (var i = 1; i < 3; i++) {
    server.create('news', {
      organizationId: organization.id
    });
  }

  visit(`/organizations/${organization.id}`);

  andThen(()=> {
    let $moreContent = find(testSelector('organization-profile-more-content'));
    assert.equal($moreContent.length, 0);
    assert.equal($moreContent.text().trim(), "");
  });

});

test("Given an organization with less than 9 news items; it renders the last 6 as news cards in the 'More Content' area", function(assert) {
  assert.expect(7);

  let organization = server.create('organization');
  let news = [];

  for (var i = 1; i < 9; i++) {
    news.push(server.create('news', {
      organizationId: organization.id
    }));
  }

  visit(`/organizations/${organization.id}`);

  andThen(()=> {
    let $moreContent = find(testSelector('organization-profile-more-content'));
    assert.equal(find(testSelector('news-card'), $moreContent).length, news.length - 2, "it has all the news items");

    news.slice(2).forEach(function(item) {
      assert.ok(find(testSelector('news-card', item.title)).length > 0, "News item exists");
    });
  });
});

test("Given news items exist not owned by orgnization; it does not include them in the more-content area", function(assert) {
  assert.expect(1);

  let organization = server.create('organization');
  let org2 = server.create('organization');

  server.create('news', {organizationId: org2.id});

  visit(`/organizations/${organization.id}`);

  andThen(()=> {
    let $moreContent = find(testSelector('organization-profile-more-content'));
    assert.equal(find(testSelector('news-card'), $moreContent).length, 0);
  });
});

test('Pagination, featured content is not display on subsequent pages', function(assert) {
  assert.expect(5);

  let organization = server.create('organization');
  let news = [];
  for (var i = 1; i < 10; i++) {
    news.push(server.create('news', {organizationId: organization.id}));
  }
  let firstPage = news.slice(2, 6);
  let nextPage = news.slice(9);

  visit(`/organizations/${organization.id}`);

  andThen(()=> {
    click(testSelector('next-page')).then(()=> {
      let $featuredContent = find(testSelector('featured-content'));
      assert.equal($featuredContent.length, 0, "Featured content is gone");

      let $moreContent = find(testSelector('organization-profile-more-content'));
      firstPage.forEach((item)=> {
        assert.equal(find(testSelector('news-card', item.title), $moreContent).length, 0, "First page news item not in list");
      });
      nextPage.forEach((item)=> {
        assert.equal(find(testSelector('news-card', item.title), $moreContent).length, 1, "Next page news item");
      });

    });
  });
});

test("Searching content: returns records matching query. Featured items gone.", function(assert) {
  assert.expect(4);

  let organization = server.create('organization');
  let news = [];
  for (var i = 1; i < 3; i++) {
    news.push(server.create('news', {organizationId: organization.id}));
  }

  let matchingArticle = server.create('news', {
    title: 'TheMatch'
  });

  visit(`/organizations/${organization.id}`);

  andThen(()=> {
    let $searchBox = find('input', testSelector('component', 'news-search'));
    fillIn($searchBox, 'TheMatch');
    triggerEvent($searchBox, 'input');
    andThen(()=> {
      let $featuredContent = find(testSelector('featured-content'));
      assert.equal($featuredContent.length, 0, "Featured content is gone");

      let $moreContent = find(testSelector('organization-profile-more-content'));

      assert.equal(find(testSelector('news-card', matchingArticle.title), $moreContent).length, 1, "shows matching article");

      news.forEach((item)=> {
        assert.equal(find(testSelector('news-card', item.title), $moreContent).length, 0, "non-matches don't show up");
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
    let $subscribeLink = find(testSelector('component', 'organization-subscribe-link'));
    assert.equal($subscribeLink.attr('href'), org1.subscribeUrl);
  });

  let org2 = server.create('organization', {
    subscribeUrl: null
  });

  visit(`/organizations/${org2.id}`).then(()=> {
    let $subscribeLink = find(testSelector('component', 'organization-subscribe-link'));
    assert.equal($subscribeLink.length, 0);
  });
});

test('Visiting news landing page, clicking organization name brings me to profile page', function(assert) {
  assert.expect(1);

  let organization = server.create('organization', {name: 'meta tauta'});
  server.create('news', {
    organizationId: organization.id,
    title: 'revelation'
  });

  visit('/news').then(()=> {
    let $newsCard = find(testSelector('news-card', 'revelation'));
    let $orgLink = find(testSelector('component', 'organization-link'), $newsCard);
    click($orgLink).then(()=> {
      assert.equal(currentURL(), `/organizations/${organization.id}-meta-tauta`);
    });
  });
});

test('Visiting news item page, clicking organization name brings me to profile page', function(assert) {
  assert.expect(1);

  let organization = server.create('organization', {name: 'meta tauta'});
  let news = server.create('news', {
    organizationId: organization.id,
    title: 'revelation'
  });

  visit(`/news/${news.id}`).then(()=> {
    let $orgLink = find(testSelector('component', 'news-show-organization-link'));
    click($orgLink).then(()=> {
      assert.equal(currentURL(), `/organizations/${organization.id}-meta-tauta`);
    });
  });
});
