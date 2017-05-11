import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sign-in-with-password', 'Integration | Component | sign in with password', {
  integration: true
});

skip('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sign-in-with-password}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sign-in-with-password}}
      template block text
    {{/sign-in-with-password}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
