import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | feed-card/dead-card', function(hooks) {
  setupRenderingTest(hooks);

  const model = {
    id: 1,
    modelType: 'news',
    title: 'God rest ye merry gentlemen!',
    contentType: 'news'
  };

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('model', model);
    await render(hbs`{{feed-card/dead-card model=model}}`);

    assert.ok(this.element);
  });
});
