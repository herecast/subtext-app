import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | content form image', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    await render(hbs`{{content-form-image}}`);

    assert.ok(this.element.textContent.trim().match(/^Choose Image/));

    // Template block usage:" + EOL +
    await render(hbs`
      {{#content-form-image}}
        template block text
      {{/content-form-image}}
    `);

    assert.ok(this.element.textContent.trim().match(/^Choose Image/));
  });
});
