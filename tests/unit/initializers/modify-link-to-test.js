import Ember from 'ember';
import ModifyLinkToInitializer from '../../../initializers/modify-link-to';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | modify link to', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ModifyLinkToInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
