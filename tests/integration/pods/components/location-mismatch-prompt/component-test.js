import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('location-mismatch-prompt', 'Integration | Component | location mismatch prompt', {
  integration: true
});

skip('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{location-mismatch-prompt}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#location-mismatch-prompt}}
      template block text
    {{/location-mismatch-prompt}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
