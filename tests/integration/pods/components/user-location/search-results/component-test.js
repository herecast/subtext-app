import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-location/search-results', 'Integration | Component | user location/search results', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{user-location/search-results}}`);

  assert.ok(this.$());
});
