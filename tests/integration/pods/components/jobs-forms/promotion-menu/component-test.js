import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | jobs-forms/promotion-menu', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('model', {});

    await render(hbs`{{jobs-forms/promotion-menu model=model}}`);

    assert.ok(this.element);
  });
});
