import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

moduleForComponent('dashboard-content-row', 'Integration | Component | dashboard content row', {
  integration: true
});

test('it hides the edit link for talk', function(assert) {
  const talk = {
    publishedAt: new Date(),
    title: 'this is a talk'
  }

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
  }

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
  }

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
  }

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

test('it shows the news pubdate when news is published', function(assert) {
  const news = {
    publishedAt: new moment().subtract(10, 'day'),
    title: 'this is a published news post'
  }

  this.set('news', news);

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=news
    }}
  `);

  const re = new RegExp(/Draft/);

  assert.notOk(this.$().text().match(re));
});

test('it identifies news content as draft when not published', function(assert) {
  const news = {
    publishedAt: null,
    title: 'this news post is not yet published'
  }

  this.set('news', news);

  this.render(hbs`
    {{dashboard-content-row
      type='news'
      content=news
    }}
  `);

  const re = new RegExp(/Draft/);

  assert.ok(this.$().text().match(re));
});
