import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | feed card/market card', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:user-location', Service.extend({
      locationId: 0,
      location: {
        name: "",
        id: 0
      },
      on(){},
      off(){}
    }));
  });

  const model = {
    id: 1,
    modelType: 'market',
    title: 'God rest ye merry gentlemen!',
    contentType: 'market',
    baseLocations: []
  };

  test('it renders', async function(assert) {

    this.set('model', model);

    await render(hbs`{{feed-card/market-card model=model}}`);

    assert.ok(this.element);
  });
});
