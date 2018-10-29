import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | link to content', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const model = {id: 1, contentId: 123};

    this.setProperties({
      model
    });

    // Template block usage:
    await render(hbs`
      {{#link-to-content model}}
        click here
      {{/link-to-content}}
    `);

    assert.ok(this.element);
  });
});
