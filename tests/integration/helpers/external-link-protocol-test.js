import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | external-link-protocol', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('inputValue', 'asdf.com');

    await render(hbs`{{external-link-protocol inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'http://asdf.com', 'should add http:// to link text without it');


    this.set('inputValue', 'http://asdf.com');

    await render(hbs`{{external-link-protocol inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'http://asdf.com', 'should pass through http:// in value');


    this.set('inputValue', 'https://asdf.com');

    await render(hbs`{{external-link-protocol inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'https://asdf.com', 'should pass through https:// in value');
  });
});
