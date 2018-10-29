import Service from '@ember/service';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | digest subscribe button', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('It shows the sign in modal when clicked by non signed in user', async function(assert) {
    const sessiontStub = Service.extend({
      isAuthenticated: false,
      authorize: function(){}
    });
    this.owner.register('service:session', sessiontStub);
    this.session = this.owner.lookup('service:session');

    const organization = {
      digestId: 1
    };

    this.set('organization', organization);

    await render(hbs`{{digest-subscribe-button organization=organization}}`);

    return settled().then(() => {
      assert.equal(this.element.textContent.trim(), 'Subscribe');

      this.element.querySelector('.DigestSubscribeButton [data-test-button]').click();

      return settled().then(() => {
        assert.ok(this.element.querySelector('.logging-in'));
      });
    });
  });

  test('it shows subscribe when user is not yet subscribed', async function(assert) {
    const sessiontStub = Service.extend({
      isAuthenticated: true,
      authorize: function(){}
    });
    this.owner.register('service:session', sessiontStub);
    this.session = this.owner.lookup('service:session');

    const organization = {
      digestId: 1
    };

    this.set('organization', organization);

    await render(hbs`{{digest-subscribe-button organization=organization}}`);

    return settled().then(() => {
      assert.equal(this.element.textContent.trim(), 'Subscribe');
    });
  });

  test('it shows unsubscribe when user is already subscribed', async function(assert) {
    const sessiontStub = Service.extend({
      isAuthenticated: true,
      authorize: function(){}
    });
    this.owner.register('service:session', sessiontStub);
    this.session = this.owner.lookup('service:session');

    const subscription = this.server.create('subscription');

    subscription.update({
      listservId: 1
    });

    const organization = {
      digestId: 1
    };

    this.set('organization', organization);

    await render(hbs`{{digest-subscribe-button organization=organization}}`);

    return settled().then(() => {
      assert.equal(this.element.textContent.trim(), 'Unsubscribe');
    });
  });
});
