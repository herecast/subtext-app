import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('site-nav/menu', 'Integration | Component | site nav/menu', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{site-nav/menu}}`);

  assert.ok(this.$());
});
