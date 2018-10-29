import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { Promise } from 'rsvp';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | market form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    const locationPromise = new Promise(resolve => resolve({id: 1}));
    const model = {
      images: [{}],
      location: locationPromise
    };
    this.set('model', model);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{market-form model=model}}`);

    assert.ok(this.element);
  });
});
