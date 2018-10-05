import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('site-nav', 'Integration | Component | site nav', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{site-nav}}`);

  assert.ok(this.$());
});
