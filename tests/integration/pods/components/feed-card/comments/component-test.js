import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | feed card/comments', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('stubbedAction', () => {});

    await render(hbs`
      {{feed-card/comments
        afterComment=(action stubbedAction)
      }}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
