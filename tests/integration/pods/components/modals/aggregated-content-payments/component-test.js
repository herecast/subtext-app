import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modals/aggregated content payments', function(hooks) {
  setupRenderingTest(hooks);


  test('It renders with a current user model', async function(assert) {
    const currentUser = {
      userId: 1
    };

    this.set('currentUser', currentUser);

    await render(hbs`{{modals/aggregated-content-payments model=currentUser}}`);

    assert.ok(this.element);
  });

  test('It renders with an organization model', async function(assert) {
    const organization = {
      id: 1
    };

    this.set('organization', organization);

    await render(hbs`{{modals/aggregated-content-payments model=organization}}`);

    assert.ok(this.element);
  });
});
