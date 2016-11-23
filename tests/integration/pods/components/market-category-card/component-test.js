import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('market-category-card', 'Integration | Component | market category card', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('category', {
    id: 1,
    name: 'foobar',
    count: '10'
  });

  this.render(hbs`{{market-category-card category=(readonly category)}}`);

  assert.equal(this.$('[data-test-name]').text().trim(), 'foobar');
  assert.equal(this.$('[data-test-count]').text().trim(), '10 items');
});
