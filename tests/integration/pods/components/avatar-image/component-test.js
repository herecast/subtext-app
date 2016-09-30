import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('avatar-image', 'Integration | Component | avatar image', {
  integration: true
});

const imageUrl = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Company+Name&w=300&h=200';

test('It renders an image when provided with one', function(assert) {

  this.set('imageUrl', imageUrl);
  this.render(hbs`{{avatar-image imageUrl=imageUrl}}`);

  assert.equal(this.$('img').length, 1);

});

test('It renders initials when provided with a name and no image', function(assert) {

  this.set('imageUrl', '');
  this.set('userName', 'A Night To Remember');

  this.render(hbs`{{avatar-image userName=userName}}`);

  assert.equal(this.$('img').length, 0);
  assert.equal(this.$('.AvatarImage--default').attr('data-content'), 'NR');

});
