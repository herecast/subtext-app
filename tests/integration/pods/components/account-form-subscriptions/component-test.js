import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | account form subscriptions', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('digests', []);
    this.set('subscriptions', []);

    await render(hbs`{{account-form-subscriptions digests=digests subscriptions=subscriptions}}`);

    assert.ok(this.element);
  });
});
