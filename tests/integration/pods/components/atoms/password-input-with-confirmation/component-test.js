import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('atoms/password-input-with-confirmation', 'Integration | Component | atoms/password input with confirmation', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{atoms/password-input-with-confirmation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#atoms/password-input-with-confirmation}}
      template block text
    {{/atoms/password-input-with-confirmation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
