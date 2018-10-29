import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event form cost', function(hooks) {
  setupRenderingTest(hooks);

  test('not applicable chosen hides the input box', async function(assert) {
    await render(hbs`{{event-form-cost costType=null}}`);
    assert.notOk(this.element.querySelector('input.notapplicable'));
  });

  test('free option chosen shows the input box', async function(assert) {
    await render(hbs`{{event-form-cost costType='free'}}`);
    assert.ok(this.element.querySelector('input.notapplicable'));
  });
});
