import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | feed carousel/feed content card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    const model = {
      contentId: 1
    };
    this.set('model', model);

    await render(hbs`{{feed-carousel/content-card model=model}}`);

    assert.ok(this.element);
  });
});
