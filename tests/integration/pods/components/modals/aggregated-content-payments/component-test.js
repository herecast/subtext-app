import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { Promise } from 'rsvp';
import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modals/aggregated content payments', function(hooks) {
  setupRenderingTest(hooks);


  test('It renders with a current user model', async function(assert) {
    const currentUser = {
      userId: 1
    };

    this.set('currentUser', currentUser);

    this.owner.register('service:api', Service.extend({
      getCurrentUserPayments() { return Promise.resolve({}); }
    }));

    await render(hbs`{{modals/aggregated-content-payments model=currentUser}}`);

    assert.ok(this.element);
  });
});
