import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-location', 'Integration | Component | user location', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{user-location}}`);

  assert.ok(this.$());
});
