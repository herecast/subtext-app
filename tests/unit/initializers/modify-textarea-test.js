import Ember from 'ember';
import ModifyTextareaInitializer from '../../../initializers/modify-textarea';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | modify textarea', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ModifyTextareaInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
