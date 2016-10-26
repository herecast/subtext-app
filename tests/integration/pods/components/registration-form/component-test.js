import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'subtext-ui/tests/helpers/setup-mirage';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

/* global sinon */

const mixpanelMock = Ember.Service.extend({
  trackEventVersion2(){}
});

moduleForComponent('registration-form', 'Integration | Component | registration form, subscriptions', {
  integration: true,
  beforeEach() {
    this.register('service:mixpanel', mixpanelMock);
    setupMirage(this.container);
  }
});

skip('after registration, triggers onSuccess action', function(assert) {
  const locations = server.createList('location', 8);
  server.createList('digest', 3);
  let afterRegister = sinon.spy();
  this.set('actions.afterRegister', afterRegister);

  this.render(hbs`{{registration-form onSuccess=(action 'afterRegister')}}`);

  return wait().then(()=>{
    let $location = this.$(".RegistrationForm-location select");
    $location.val(locations[0].id).change();

    let $name = this.$(".RegistrationForm-name");
    $name.val('Marshall Mathers').change();

    let $email = this.$(".RegistrationForm-email");
    $email.val('slim_shady@example.com').change();

    let $password = this.$('.RegistrationForm-password');
    $password.val('willtherealslimshadypleasestandup1').change();

    this.$('.RegistrationForm-terms').click();
    this.$('.RegistrationForm-submitAction').click();

    return wait().then(()=> {
      assert.ok(afterRegister.called);
    });

  });
});

test('when no digest options available, subscribe cta is not shown', function(assert) {
  this.set('digests', []);

  this.render(hbs`{{registration-form digests=digests}}`);

  return wait().then(() => {
    const $digests = this.$().find(testSelector('digest-subscribe'));

    assert.equal($digests.length, 0);
  });
});
