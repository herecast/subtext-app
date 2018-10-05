/* global sinon */
import Ember from 'ember';
import { moduleForComponent, skip, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

const {
  RSVP: {Promise}
} = Ember;

moduleForComponent('sign-in-or-register-with-password', 'Integration | Component | sign in or register with password', {
  integration: true
});

skip('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sign-in-or-register-with-password}}`);

  assert.equal(this.$().text().trim(), '');
});

test('Regstration: already used email', function(assert) {
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

  this.render(
    hbs`{{sign-in-or-register-with-password
          api=api
          userLocation=userLocation
          notify=notify
        }}`
  );

  this.$('[data-test-link=join-tab]').trigger('click');

  return wait().then(() => {
    this.$('[data-test-field=sign-in-email]').val('test@test.local').trigger('change');
    this.$('[data-test-field=sign-in-password]').val('12432qkl').trigger('change');
    this.$('[data-test-component=sign-in-submit]').trigger('click');

    return wait().then(()=> {
      assert.ok(
        notify.error.calledWith('An account already exists with that email. Try signing in instead.'),
        "Should notify the user that the account exists");
    });
  });
});

test('Regstration: unknown error', function(assert) {
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

  this.render(
    hbs`{{sign-in-or-register-with-password
          api=api
          userLocation=userLocation
          notify=notify
        }}`
  );

  this.$('[data-test-link=join-tab]').trigger('click');

  return wait().then(() => {
    this.$('[data-test-field=sign-in-email]').val('test@test.local').trigger('change');
    this.$('[data-test-field=sign-in-password]').val('12432qkl').trigger('change');
    this.$('[data-test-component=sign-in-submit]').trigger('click');

    return wait().then(()=> {
      assert.ok(
        notify.error.calledWith('An unknown error has occurred. Please contact support.'),
        "Should notify the user to contact support");
    });
  });
});
