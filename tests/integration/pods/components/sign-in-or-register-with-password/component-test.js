import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | sign in or register with password', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    render(hbs`{{sign-in-or-register-with-password}}`);

    assert.ok(this.element);
  });

});
