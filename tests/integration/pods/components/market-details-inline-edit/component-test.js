import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('market-details-inline-edit', 'Integration | Component | market details inline edit', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{market-details-inline-edit}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#market-details-inline-edit}}
      template block text
    {{/market-details-inline-edit}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
