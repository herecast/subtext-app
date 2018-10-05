import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-location/chooser', 'Integration | Component | user location/chooser', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{user-location/chooser}}`);

  assert.ok(this.$());
});
