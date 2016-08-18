import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global sinon */

const promotionStub = Ember.Service.extend({
  find() {
    return { then() {} };
  }
});

moduleForComponent('ad-banner', 'Integration | Component | ad banner', {
  integration: true,

  beforeEach() {
    this.register('service:promotion', promotionStub);
    this.inject.service('promotion');
  }
});

test('it renders', function(assert) {
  assert.expect(1);
  const { stub, spy } = sinon;

  this.setProperties({
    api                      : spy(),
    _viewportOptionsOverride : stub(),
    stubViewportHook: stub()
  });

  this.render(hbs`{{ad-banner
              _viewportOptionsOverride=_viewportOptionsOverride
              api=api
              didEnterViewport=stubViewportHook
              didExitViewport=stubViewportHook
  }}`);

  assert.equal(this.$().text().trim(), '');
});