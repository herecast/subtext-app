import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import RSVP from 'rsvp';
import sinon from 'sinon';

const apiStub = Service.extend({
  getContentPromotions() {
    return RSVP.resolve({promotions: []});
  },
  recordAdMetricEvent() {
    return true;
  }//outreach-cta component
});

module('Integration | Component | ad banner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);
    const { stub } = sinon;

    this.owner.register('service:api', apiStub);

    this.setProperties({
      _viewportOptionsOverride : stub(),
      stubViewportHook: stub(),
      api: this.owner.lookup('service:api')
    });

    await render(hbs`{{ad-banner
                _viewportOptionsOverride=_viewportOptionsOverride
                api=api
                didEnterViewport=stubViewportHook
                didExitViewport=stubViewportHook
    }}`);

    assert.ok(1);
  });
});
