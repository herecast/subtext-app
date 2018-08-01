import { startMirage } from 'subtext-ui/initializers/ember-cli-mirage';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('digest-subscribe-button', 'Integration | Component | digest subscribe button', {
  integration: true,
  beforeEach() {
    this.server = startMirage();
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('It shows the sign in modal when clicked by non signed in user', function(assert) {
  const sessiontStub = Ember.Service.extend({
    isAuthenticated: false,
    authorize: function(){}
  });
  this.register('service:session', sessiontStub);
  this.inject.service('session');

  const organization = {
    digestId: 1
  };

  this.set('organization', organization);

  this.render(hbs`{{digest-subscribe-button organization=organization}}`);

  return wait().then(() => {
    assert.equal(this.$().text().trim(), 'Subscribe');

    this.$('.DigestSubscribeButton [data-test-button]').click();

    return wait().then(() => {
      assert.ok(this.$('.logging-in').length);
    });
  });
});

test('it shows subscribe when user is not yet subscribed', function(assert) {
  const sessiontStub = Ember.Service.extend({
    isAuthenticated: true,
    authorize: function(){}
  });
  this.register('service:session', sessiontStub);
  this.inject.service('session');

  const organization = {
    digestId: 1
  };

  this.set('organization', organization);

  this.render(hbs`{{digest-subscribe-button organization=organization}}`);

  return wait().then(() => {
    assert.equal(this.$().text().trim(), 'Subscribe');
  });
});

test('it shows unsubscribe when user is already subscribed', function(assert) {
  const sessiontStub = Ember.Service.extend({
    isAuthenticated: true,
    authorize: function(){}
  });
  this.register('service:session', sessiontStub);
  this.inject.service('session');

  const subscription = server.create('subscription');

  subscription.update({
    listservId: 1
  });

  const organization = {
    digestId: 1
  };

  this.set('organization', organization);

  this.render(hbs`{{digest-subscribe-button organization=organization}}`);

  return wait().then(() => {
    assert.equal(this.$().text().trim(), 'Unsubscribe');
  });
});
