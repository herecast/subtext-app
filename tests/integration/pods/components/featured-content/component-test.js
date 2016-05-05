import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

moduleForComponent('featured-content', 'Integration | Component | featured content', {
  integration: true
});

test('It displays content image', function(assert) {
  this.set('content', {
    imageUrl: 'http://ex.test/img.jpg'
  });

  this.render(hbs`{{featured-content model=content}}`);

  let $img = this.$('.FeaturedContent-featuredImage img');
  assert.equal($img.attr('src'), 'http://ex.test/img.jpg');
});

test('It displays content title', function(assert) {
  this.set('content', {
    title: 'This is rad'
  });

  this.render(hbs`{{featured-content model=content}}`);

  let $title = this.$('.FeaturedContent-title');
  assert.equal($title.text().trim(), 'This is rad');
});

test('It displays the content', function(assert) {
  let content = {
    content: 'This Content will be excerpted with css'
  };

  this.set('content', content);

  this.render(hbs`{{featured-content model=content}}`);

  let $teaser = this.$('.FeaturedContent-content');
  assert.equal($teaser.text().trim(), content.content);
});

test('It displays relative published at time', function(assert) {
  let content = {
    publishedAt: new Date()
  };

  this.set('content', content);

  this.render(hbs`{{featured-content model=content}}`);

  let $when = this.$('.FeaturedContent-whenPublished');
  assert.equal($when.text().trim(), 'a few seconds ago');
  
  this.set('content.publishedAt', moment().subtract(4, 'days').toDate()); 
  assert.equal($when.text().trim(), '4 days ago');
});

test('It displays organization info', function(assert) {
  let organization = {
    logoUrl: 'http://go.test/this',
    name: "Test Blog"
  };
  this.set('content', {
    organization: organization
  });

  this.render(hbs`{{featured-content model=content}}`);

  let $pub = this.$('.FeaturedContent-publisher');
  assert.equal($pub.text().trim(), organization.name);

  let $pubImage = this.$('.FeaturedContent-publisherAvatar');
  assert.equal($pubImage.attr('src'), organization.logoUrl);
});
