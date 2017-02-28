import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('image-tile-spinner', 'Integration | Component | image tile spinner', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{image-tile-spinner}}`);

  assert.equal(this.$().text().trim(), 'Please wait...');
});
