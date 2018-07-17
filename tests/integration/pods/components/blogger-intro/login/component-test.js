import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('blogger-intro/login', 'Integration | Component | blogger intro/login', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{blogger-intro}}`);

  assert.ok(this.$());
});
