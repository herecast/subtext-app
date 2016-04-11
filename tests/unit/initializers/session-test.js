import Ember from 'ember';
import SessionInitializer from '../../../initializers/session';
import { module, test } from 'qunit';

let container, application;

module('Unit | Initializer | session', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  SessionInitializer.initialize(container, application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
