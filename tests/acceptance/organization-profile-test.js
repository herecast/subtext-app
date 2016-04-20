import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import moment from 'moment';

moduleForAcceptance('Acceptance | organization profile');

test('Displays organization info', function(assert) {
  const organization = server.create('organization', {
    logo: 'http://placehold.it/200x200',
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
      organization.logo,
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

test('Given an organization with 3 news items; The newest 2 display in the featured area.', function(assert) {
  let organization = server.create('organization');
  let news = [];

  news.push(server.create('news', {
    organization_id: organization.id,
    publishedAt: moment().subtract(1,'days').format()
  }));
  news.push(server.create('news', {
    organization_id: organization.id,
    publishedAt: moment().subtract(2,'days').format()
  }));
  news.push(server.create('news', {
    organization_id: organization.id,
    publishedAt: moment().subtract(3,'days').format()
  }));

  visit(`/organizations/${organization.id}`);

  andThen(() =>{
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

test("Given an organization with less than 7 news items; it renders them as news cards in the 'More Content' area", function(assert) {
  let organization = server.create('organization');
  let news = [];

  for(var i = 1; i < 7; i++) {
    news.push(server.create('news', {
      organization_id: organization.id
    }));
  }

  visit(`/organizations/${organization.id}`);

  andThen(()=>{
    let $moreContent = find(testSelector('organization-profile-more-content'));
    assert.equal( find(testSelector('news-card'), $moreContent).length, news.length, "it has all the news items" );
  });
});

test("Given news items exist not owned by orgnization; it does not include them in the more-content area", function(assert) {
  let organization = server.create('organization');
  let org2 = server.create('organization');

  server.create('news', {organization_id: org2.id });

  visit(`/organizations/${organization.id}`);

  andThen(()=>{
    let $moreContent = find(testSelector('organization-profile-more-content'));
    assert.equal( find(testSelector('news-card'), $moreContent).length, 0);
  });
});
