import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-location/cta-button', 'Integration | Component | user location/cta button', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{user-location/cta-button}}`);

  assert.ok(this.$());
});
