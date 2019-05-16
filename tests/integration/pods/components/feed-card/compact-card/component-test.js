import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | feed-card/compact-card', function(hooks) {
  setupRenderingTest(hooks);

  const model = {
    id: 1,
    modelType: 'news',
    title: 'God rest ye merry gentlemen!',
    contentType: 'news',
    baseLocations: []
  };

  test('it renders', async function(assert) {
    this.set('model', model);

    await render(hbs`{{feed-card/compact-card model=model}}`);

    assert.ok(this.element);
  });
});
