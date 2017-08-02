import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

const apiStub = Ember.Service.extend({
  getEventCategories() {
    return Ember.RSVP.Promise.resolve({
      'event_categories':[]
    });
  },
  getFeatures() {
    return Ember.RSVP.Promise.resolve({'features': []});
  }
});

moduleForComponent('events-filter', 'Integration | Component | events filter', {
  integration: true,

  beforeEach() {
    this.register('service:api', apiStub);
    this.inject.service('api');
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{events-filter}}`);

  return wait().then(() => {
      assert.ok(1);
  });



});
