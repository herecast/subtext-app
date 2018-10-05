import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('site-nav/user-menu', 'Integration | Component | site nav/user menu', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{site-nav/user-menu}}`);

  assert.ok(this.$());
});
