import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import { Promise } from 'rsvp';

const apiStub = Service.extend({
  getListServs() { return Promise.resolve([]); }
});

module('Integration | Component | jobs-forms/promotion-menu', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.owner.register('service:api', apiStub);
    this.api = this.owner.lookup('service:api');
    this.set('model', {});

    await render(hbs`{{jobs-forms/promotion-menu model=model}}`);

    assert.ok(this.element);
  });
});
