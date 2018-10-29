import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | business search', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('updateFromQuery', () => {});
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    await render(hbs`
      {{business-search
        updateFromQuery=(action updateFromQuery)
      }}
    `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
