import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForComponent('dashboard-content-row', 'Integration | Component | dashboard content row', {
  integration: true
});

test('it hides the edit link for talk', function(assert) {
  const talk = {
    publishedAt: new Date(),
    title: 'this is a talk'
  };

  this.set('talk', talk);

  this.render(hbs`
    {{dashboard-content-row
      type='Talk'
      content=talk
    }}
  `);

  const re = new RegExp(/Edit/);

  assert.notOk(this.$().text().match(re));
});

test('it shows the edit link for market', function(assert) {
  const market = {
    publishedAt: new Date(),
    title: 'this is a market post'
  };

  this.set('market', market);

  this.render(hbs`
    {{dashboard-content-row
      type='market-post'
      content=market
    }}
  `);

  const re = new RegExp(/Edit/);

  assert.ok(this.$().text().match(re));
});

test('it shows the edit link for events', function(assert) {
  const event = {
    publishedAt: new Date(),
    title: 'this is an event'
  };

  this.set('event', event);

  this.render(hbs`
    {{dashboard-content-row
      type='event-instance'
      content=event
    }}
  `);

  const re = new RegExp(/Edit/);

  assert.ok(this.$().text().match(re));
});

test('it shows the edit link for news', function(assert) {
  const news = {
    publishedAt: new Date(),
    title: 'this is a news post'
  };

  this.set('news', news);

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=news
    }}
  `);

  const re = new RegExp(/Edit/);

  assert.ok(this.$().text().match(re));
});

test('it shows the news pubdate when news is scheduled', function(assert) {
  const news = {
    publishedAt: moment().add(10, 'day'),
    title: 'this is a future news post',
    isScheduled: true,
    contentType: 'news'
  };

  this.set('news', news);

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=news
    }}
  `);

  const re = new RegExp(/Scheduled to go live /);

  assert.ok(this.$().text().trim().match(re));
});

test('it shows the news pubdate when news is published', function(assert) {
  const news = {
    publishedAt: moment().subtract(10, 'day'),
    title: 'this is a published news post',
    isPublished: true,
    contentType: 'news'
  };

  this.set('news', news);

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=news
    }}
  `);

  const re = new RegExp(/Publish date/);

  assert.ok(this.$().text().trim().match(re));
});

test('it identifies news content as draft when not published', function(assert) {
  const news = {
    publishedAt: null,
    updatedAt: moment(new Date()).toISOString(),
    isDraft: true,
    contentType: 'news',
    title: 'this news post is not yet published'
  };

  this.set('news', news);

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=news
    }}
  `);

  const re = new RegExp(/Draft last updated/);

  assert.ok(this.$().text().trim().match(re));
});

test('it does not show delete link for non-news content', function(assert) {
  const content = {
    publishedAt: null,
    title: 'this content isn\'t news',
    contentType: 'market-post'
  };

  this.set('content', content);
  this.set('actions', { deleteContent() {} });

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=content
    }}
  `);

  let $deleteLink = this.$(testSelector('action-delete'));
  assert.ok($deleteLink.length === 0, "delete link should not be present");
});

test('it shows the delete link for news items in draft state', function(assert) {
  const news = Ember.Object.create({
    publishedAt: null,
    updatedAt: moment(new Date()).toISOString(),
    title: 'this news post is not yet published',
    isDraft: true,
    contentType: 'news'
  });

  this.set('news', news);
  this.set('actions', { deleteContent() {} });

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=news
    }}
  `);

  let $deleteLink = this.$(testSelector('action-delete'));
  assert.ok($deleteLink.length === 1, "delete link should be present if news post is draft");
});

test('it shows the delete link for news items in draft state', function(assert) {
  const news = {
    publishedAt: null,
    title: 'this news post is not yet published',
    isDraft: false,
    contentType: 'news'
  };

  this.set('news', news);
  this.set('actions', { deleteContent() {} });

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=news
    }}
  `);

  let $deleteLink = this.$(testSelector('action-delete'));
  assert.ok($deleteLink.length === 0, "delete link should not be present unless news post is draft");
});
