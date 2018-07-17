import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('blogger-intro/status-button', 'Integration | Component | blogger intro/status button', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{blogger-intro}}`);

  assert.ok(this.$());
});
