import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | search input', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    await render(hbs`{{search-input}}`);

    assert.equal(this.element.textContent.trim(), '');

  });

  test('pressing ESC clears the value', async function(assert) {
    this.set('value', "Taco");

    await render(hbs`{{search-input value=value update=(action (mut value)) debounceWait=0}}`);

    const escKey = 27;
    let $inp = this.element.querySelector('input');
    $inp.value = 'query';

    await triggerKeyEvent($inp, 'keyup', escKey)

    assert.equal($inp.value, "");
  });

  test('pressing the x button clears the value', async function(assert) {
    this.set('value', "Taco");
    await render(hbs`{{search-input value=value update=(action (mut value)) debounceWait=0}}`);

    let $inp = this.element.querySelector('input');

    await click(this.element.querySelector('.SearchInput-clear'));

    assert.equal($inp.value, "");
  });
});
