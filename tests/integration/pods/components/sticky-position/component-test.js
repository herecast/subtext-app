import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sticky-position', 'Integration | Component | sticky position', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{sticky-position}}`);

  assert.ok(this.$());
});
