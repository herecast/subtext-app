import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-location/search-input', 'Integration | Component | user location/search input', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{user-location/search-input}}`);

  assert.ok(this.$());
});
