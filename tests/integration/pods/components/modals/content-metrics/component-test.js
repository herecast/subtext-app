import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Service from '@ember/service';
import RSVP from 'rsvp';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modals/content metrics', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:content-metrics', Service.extend({
      getMetrics() {
        return RSVP.resolve([]);
      }
    }));
  });

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{modals/content-metrics}}`);

    assert.ok(this.element);

  });
});
