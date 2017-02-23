import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('image-tile', 'Integration | Component | image tile', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{image-tile imageUrl="data:image/jpeg;"}}`);

  assert.equal(
    this.$('img').attr('src'),
    "data:image/jpeg;"
  );
});

test('given an argument for remove action', function(assert) {

  this.setProperties({
    removeImage() {
      assert.ok(true,
      'clicking remove button calls remove action');
    }
  });

  this.render(hbs`{{image-tile remove=(action removeImage)}}`);

  assert.ok(
    this.$('.ImageTile-removeAction').length > 0,
    "Remove action is visible"
  );
});

test('not given an argument for remove action', function(assert) {

  this.render(hbs`{{image-tile}}`);

  assert.ok(
    this.$('.ImageTile-removeAction').length === 0,
    "Remove button is not visible"
  );
});

test('given an argument for setPrimary action', function(assert) {

  this.setProperties({
    setPrimaryAction() {
      assert.ok(true,
      'clicking primary button calls setPrimary action');
    }
  });

  this.render(hbs`{{image-tile setPrimary=(action setPrimaryAction)}}`);

  assert.ok(
    this.$('.ImageTile-setPrimaryAction').length > 0,
    "Set Primary button is visible"
  );
});

test('not given an argument for setPrimary action', function(assert) {

  this.render(hbs`{{image-tile}}`);

  assert.ok(
    this.$('.ImageTile-setPrimaryAction').length === 0,
    "set primary button is not visible"
  );
});

test('Set as primary', function(assert) {
  this.render(hbs`{{image-tile isPrimary=true}}`);

  assert.ok(
    this.$('.ImageTile').hasClass('is-primary'),
    "Adds 'is-primary' class to component tag"
  );
});
