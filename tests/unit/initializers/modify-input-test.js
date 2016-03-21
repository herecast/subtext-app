import Ember from 'ember';
import ModifyInputInitializer from '../../../initializers/modify-input';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | modify input', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ModifyInputInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
