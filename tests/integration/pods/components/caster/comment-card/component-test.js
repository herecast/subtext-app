import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | caster/comment-card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('parentContent', {});
    this.set('casterId', 1);

    await render(hbs`{{caster/comment-card
      parentContent=parentContent
      casterId=casterId
    }}`);

    assert.ok(this.element);
  });
});
