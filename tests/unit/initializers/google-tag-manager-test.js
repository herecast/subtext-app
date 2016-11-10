import Ember from 'ember';
import GoogleTagManagerInitializer from '../../../initializers/browser/google-tag-manager';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | google tag manager', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  GoogleTagManagerInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
