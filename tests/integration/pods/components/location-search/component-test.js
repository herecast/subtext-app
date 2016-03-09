import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('location-search', 'Integration | Component | location search', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{location-search}}`);

  assert.equal(this.$().text().trim(), '');
});

test('location displays in box', function(assert) {
  const location = "Hartford, VT";

  this.set('locationText', location);
  this.render(hbs`{{location-search location=locationText}}`);

  assert.equal(this.$('input').val(), location);
});
/*
test('suggest box displays when input focused', function(assert) {
  this.render(hbs`{{location-search}}`);
  assert.notOk(this.$('.LocationFilter-suggestions').length);

  this.$('input').trigger('focus');
  assert.ok(this.$('.LocationFilter-suggestions').length);

  this.$('input').blur();
  assert.notOk(this.$('.LocationFilter-suggestions').length);
});
*/
