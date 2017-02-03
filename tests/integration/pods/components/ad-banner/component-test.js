import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global sinon */

const apiStub = Ember.Service.extend({
  getContentPromotion() {
    return { then() {} };
  },
  recordOutreachCtaEvent() {
    return true;
  }//outreach-cta component
});

moduleForComponent('ad-banner', 'Integration | Component | ad banner', {
  integration: true,

  beforeEach() {
    this.register('service:api', apiStub);
    this.inject.service('api');
  }
});

test('it renders', function(assert) {
  assert.expect(1);
  const { stub } = sinon;

  this.setProperties({
    _viewportOptionsOverride : stub(),
    stubViewportHook: stub()
  });

  this.render(hbs`{{ad-banner
              _viewportOptionsOverride=_viewportOptionsOverride
              api=api
              didEnterViewport=stubViewportHook
              didExitViewport=stubViewportHook
  }}`);

  assert.ok(1);
});
