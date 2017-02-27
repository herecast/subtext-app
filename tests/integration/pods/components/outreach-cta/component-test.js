import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const apiStub = Ember.Service.extend({
  recordAdMetricEvent() {
    return true;
  }//outreach-cta component
});

const currentControllerStub = Ember.Service.extend({
  currentUrl() {
    return 'string';
  }//outreach-cta component
});

moduleForComponent('outreach-cta', 'Integration | Component | advertise cta', {
  integration: true,
  beforeEach() {
    this.register('service:api', apiStub);
    this.inject.service('api');

    this.register('service:currentController', currentControllerStub);
    this.inject.service('currentController');
  }
});

test('it renders', function(assert) {

  this.render(hbs`{{outreach-cta isTextOnly=true}}`);

  assert.equal(this.$('a').length, 1);

});
