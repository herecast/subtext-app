import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mystuff/comment-card', 'Integration | Component | mystuff/comment card', {
  integration: true
});

test('it renders', function(assert) {

  const comment = {
    title: 'Best Comment',
    content: '<p>Best Content</p>'
  };

  this.set('comment', comment);

  this.render(hbs`{{mystuff/comment-card comment=comment}}`);

  assert.ok(this.$(), 'comment card renders');

  assert.equal(this.$('.Mystuff-CommentCard-title').text().trim(), 'Best Comment', 'has correct title');

  assert.equal(this.$('.Comment-content').text().trim(), 'Best Content', 'has correct content');
});
