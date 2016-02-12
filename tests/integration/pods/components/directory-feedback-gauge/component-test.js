import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('directory-feedback-gauge', 'Integration | Component | directory feedback gauge', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{directory-feedback-gauge}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#directory-feedback-gauge}}
      template block text
    {{/directory-feedback-gauge}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
