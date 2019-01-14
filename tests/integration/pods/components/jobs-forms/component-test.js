import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';


module('Integration | Component | jobs-forms', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const location = {
      id: 1,
      city: 'city',
      state: 'ST'
    };

    this.set('model', {
      images: [],
      schedules: [],
      location: Promise.resolve(location),
      rollbackAttributes() {}
    });

    await render(hbs`{{jobs-forms editingModel=model}}`);

    assert.ok(this.element);
  });
});
