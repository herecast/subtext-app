import Application from '@ember/application';
import { run } from '@ember/runloop';
import { initialize } from '../../../initializers/component-store-injection';
import { module, test } from 'qunit';

let application;

module('ComponentStoreInjectionInitializer', function(hooks) {
  hooks.beforeEach(function() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  });

  // Replace this with your real tests.
  test('it works', function(assert) {
    initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
