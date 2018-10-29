import sinon from 'sinon';
import { Promise } from 'rsvp';
import { module, skip, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | sign in or register with password', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{sign-in-or-register-with-password}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('Regstration: already used email', async function(assert) {
    const done = assert.async();
    const notify = {
      error: sinon.spy()
    };

    const userLocation = {
      userLocation: new Promise((resolve) => {
        resolve({id: 1});
      })
    };

    const api = {
      createRegistration() {
        return new Promise((resolve, reject) => {
          done();
          reject({
            errors: {email: ["has already been taken"]}
          });
        });
      }
    };

    this.setProperties({notify, api, userLocation});

    await render(hbs`{{sign-in-or-register-with-password
          api=api
          userLocation=userLocation
          notify=notify
        }}`);

    await click('[data-test-link=join-tab]');

    await fillIn('[data-test-field=sign-in-email]', 'test@test.local');
    await fillIn('[data-test-field=sign-in-password]', '12432qkl');

    await click('[data-test-component=sign-in-submit]');

    assert.ok(
      notify.error.calledWith('An account already exists with that email. Try signing in instead.'),
      "Should notify the user that the account exists");
  });

  test('Regstration: unknown error', async function(assert) {
    const done = assert.async();
    const notify = {
      error: sinon.spy()
    };

    const userLocation = {
      userLocation: new Promise((resolve) => {
        resolve({id: 1});
      })
    };

    const api = {
      createRegistration() {
        return new Promise((resolve, reject) => {
          done();
          reject({
            errors: {unknown: ["error"]}
          });
        });
      }
    };

    this.setProperties({notify, api, userLocation});

    await render(hbs`{{sign-in-or-register-with-password
          api=api
          userLocation=userLocation
          notify=notify
        }}`);

    await click('[data-test-link=join-tab]');

    await fillIn('[data-test-field=sign-in-email]', 'test@test.local');
    await fillIn('[data-test-field=sign-in-password]', '12432qkl');

    await click('[data-test-component=sign-in-submit]');

    assert.ok(
      notify.error.calledWith('An unknown error has occurred. Please contact support.'),
      "Should notify the user to contact support");
  });
});
