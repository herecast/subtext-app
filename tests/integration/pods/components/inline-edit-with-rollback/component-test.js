import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inline-edit-with-rollback', 'Integration | Component | inline edit with rollback', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{inline-edit-with-rollback}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#inline-edit-with-rollback}}
      template block text
    {{/inline-edit-with-rollback}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
