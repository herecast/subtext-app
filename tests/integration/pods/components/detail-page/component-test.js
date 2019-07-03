import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const promotionStub = Service.extend({
  find() {
    return { then() {} };
  }
});

const adStub = Service.extend({
  getAd() {
   return { then() {} };
  }
});

const apiStub = Service.extend({
  recordAdMetricEvent() {
   return { then() {} };
  }
});

module('Integration | Component | detail page', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:promotion', promotionStub);
    this.owner.register('service:ads', adStub);
    this.owner.register('service:api', apiStub);
  });


  test('it renders', async function(assert) {
    assert.expect(1);

    this.set('model', {id: 1});

    await render(hbs`
      {{detail-page
        model=model
      }}
    `);

    assert.ok(this.element);
  });
});
