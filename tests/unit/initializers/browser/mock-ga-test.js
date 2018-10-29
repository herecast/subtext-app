import Application from '@ember/application';
import { run } from '@ember/runloop';
import { initialize } from 'subtext-ui/initializers/mock-ga';
import { module, test } from 'qunit';
import destroyApp from '../../../helpers/destroy-app';
import config from 'subtext-ui/config/environment';

module('Unit | Initializer | browser/mock ga', function(hooks) {
  hooks.beforeEach(function() {
    run(() => {
      this.application = Application.create();
      this.application.deferReadiness();
    });
  });

  hooks.afterEach(function() {
    destroyApp(this.application);
  });

  // Replace this with your real tests.
  test('it works', function(assert) {
    window.ga = undefined;
    config.mockWindowGa = true;

    initialize(this.application);

    // you would normally confirm the results of the initializer here
    assert.ok(typeof window.ga !== 'undefined');
    window.ga = undefined;
  });
});
