import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('comment-new', 'Integration | Component | comment new', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{comment-new}}`);

  assert.ok(this.$());
});

test('it sanitizes', function(assert) {
  const iframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';

  this.set('commentText', `abcdef-${iframe}-ghik`);

  this.render(hbs`{{comment-new newComment=commentText}}`);

  this.$('textarea').trigger('keyup');

  assert.equal(this.$('textarea').val(), 'abcdef--ghik', 'Should strip all html from comments');
});

test('it truncates', function(assert) {
  const longText = 'And then I went to the town where they have dogs and cats and little matchstick boys selling all kinds of cigars and sundries to the lonely folks in their dwellings with red metal roofs and baskets for windows that shake as the wind blows through their openings and fun times.';
  const maxLength = 200;

  this.set('longText', longText);
  this.set('maxLength', maxLength);

  this.render(hbs`{{comment-new newComment=longText maxCommentLength=maxLength}}`);

  this.$('textarea').trigger('keyup');

  assert.equal(this.$('textarea').val().length, maxLength, 'Should truncate text to max length set in component');
});
