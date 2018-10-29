import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | sign in', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{sign-in}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    this.render(hbs`
      {{#sign-in}}
        template block text
      {{/sign-in}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
