import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import RSVP from 'rsvp';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user location/ugc button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const model = {
      location: RSVP.resolve({city: 'Hanover', state: "NH"})
    };
    this.set('model', model);
    await render(hbs`{{user-location/ugc-button model=model}}`);

    assert.ok(this.element);
  });
});
