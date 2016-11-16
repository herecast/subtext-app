import Ember from 'ember';
import RegisterGoogleMapsInitializer from '../../../initializers/browser/register-google-maps';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | register google maps', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RegisterGoogleMapsInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
