import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | detail-page/caster-footer', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('model', {});
    await render(hbs`{{detail-page/caster-footer model=model}}`);

    assert.ok(this.element);
  });
});
