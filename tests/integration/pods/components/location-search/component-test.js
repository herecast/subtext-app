import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | location search', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{location-search}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('location displays in box', async function(assert) {
    const location = "Hartford, VT";

    this.set('locationText', location);
    await render(hbs`{{location-search location=locationText}}`);

    assert.equal(this.element.querySelector('input').value, location);
  });
});
