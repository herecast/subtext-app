import { module, test } from 'qunit';
import RSVP from 'rsvp';
import Service from '@ember/service';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modals/aggregated content metrics', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:content-metrics', Service.extend({
      getMetrics() {
        return RSVP.resolve([]);
      }
    }));
  });

  test('It renders with a current user model', async function(assert) {
    const currentUser = {
      userId: 1,
      'constructor': {
        modelName: 'current-user'
      }
    };

    this.set('currentUser', currentUser);

    await render(hbs`{{modals/aggregated-content-metrics model=currentUser}}`);

    assert.ok(this.element);
  });
});
