import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const apiStub = Service.extend({
  recordAdMetricEvent() {
    return true;
  }//outreach-cta component
});

const currentControllerStub = Service.extend({
  currentUrl() {
    return 'string';
  }//outreach-cta component
});

module('Integration | Component | outreach cta', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:api', apiStub);
    this.api = this.owner.lookup('service:api');

    this.owner.register('service:currentController', currentControllerStub);
    this.currentController = this.owner.lookup('service:currentController');
  });

  test('it renders', async function(assert) {

    await render(hbs`{{outreach-cta isTextOnly=true}}`);

    assert.ok(this.element.querySelector('a'));

  });
});
