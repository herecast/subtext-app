import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | formatted-count', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('inputValue', '999');

    await render(hbs`{{formatted-count inputValue}}`);

    assert.equal(this.element.textContent.trim(), '999', 'leaves less than a thousand alone');


    this.set('inputValue', '1001');

    await render(hbs`{{formatted-count inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1,001', 'adds comma over a thousand');


    this.set('inputValue', '10001');

    await render(hbs`{{formatted-count inputValue}}`);

    assert.equal(this.element.textContent.trim(), '10.0 K', 'consolidates over ten thousand');


    this.set('inputValue', '100001');

    await render(hbs`{{formatted-count inputValue}}`);

    assert.equal(this.element.textContent.trim(), '100 K', 'consolidates over one hundred thousand');


    this.set('inputValue', '1000001');

    await render(hbs`{{formatted-count inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1.00 M', 'consolidates over one Million');


  });
});
