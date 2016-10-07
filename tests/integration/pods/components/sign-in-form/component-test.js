import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

/* global sinon */

const { RSVP } = Ember;

const sessionMock = Ember.Service.extend({
});

const mixpanelMock = Ember.Service.extend({
  trackEventVersion2(){}
});

moduleForComponent('sign-in-form', 'Integration | Component | sign in form', {
  integration: true,

  beforeEach() {
    this.register('router:main', Ember.Router.extend({
      generate: function(){}
    }));

    this.register('service:session', sessionMock);
    this.register('service:mixpanel', mixpanelMock);
    this.inject.service('session', {as: 'session'});
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{sign-in-form}}`);
  assert.ok(this.$());
});

test('When filling in and submitting form it authenticates', function(assert) {
  const authenticate = sinon.stub().returns(new RSVP.Promise(function(){}));
  const email = 'test@bob.com';
  const pass = '1234';

  this.set('session.authenticate', authenticate);

  this.render(hbs`{{sign-in-form}}`);

  let $inpEmail = this.$('.SignInForm-emailInput');
  $inpEmail.val(email).change();

  let $inpPass = this.$('.SignInForm-passwordInput');
  $inpPass.val(pass).change();

  let $btn = this.$('.SignInForm-submitButton');
  $btn.click();

  assert.ok(authenticate.calledWith('authenticator:application', email, pass));
});

test('When the user must confirm before continuing, it displays the message with link to confirm', function(assert) {
  const authenticate = sinon.stub().returns(new RSVP.Promise(function(resolve, reject){
    reject({error: 'User must confirm.'});
  }));
  this.set('session.authenticate', authenticate);

  this.render(hbs`{{sign-in-form}}`);

  let $btn = this.$('.SignInForm-submitButton');
  $btn.click();

  return wait().then(() => {
    let $reconfirmMsg = this.$('.SignInForm-reconfirmMessage');
    assert.ok($reconfirmMsg.find('.SignInForm-reconfirmAction').length);
  });
});


test('When the user must confirm and clicks the confirm link, it triggers onReconfirm action', function(assert) {
  const authenticate = sinon.stub().returns(new RSVP.Promise(function(resolve, reject){
    reject({error: 'User must confirm.'});
  }));
  this.set('session.authenticate', authenticate);

  let reconfirm = sinon.spy();
  this.set('reconfirm', reconfirm);

  this.render(hbs`{{sign-in-form onReconfirm=(action reconfirm)}}`);

  const email = 'test@bob.com';
  let $inpEmail = this.$('.SignInForm-emailInput');
  $inpEmail.val(email).change();

  let $btn = this.$('.SignInForm-submitButton');
  $btn.click();

  return wait().then(() => {
    let $reconfirmLink = this.$('.SignInForm-reconfirmAction');
    $reconfirmLink.click();
    assert.ok(reconfirm.calledWith(email));
  });
});

test('When clicking Forgot Password link, onForgotPassword is triggered', function(assert) {
  let passwordAction = sinon.spy();
  this.set('passwordReset', passwordAction);

  this.render(hbs`{{sign-in-form onForgotPassword=(action passwordReset)}}`);

  let $forgotPwLink = this.$('.SignInForm-forgotPasswordAction');
  $forgotPwLink.click();

  assert.ok(passwordAction.called);
});

test('When request error, it highlights email & password fields, displaying error message', function(assert){
  let errMsg = 'You must sign in or sign up before continuing';

  const authenticate = sinon.stub().returns(new RSVP.Promise(function(resolve, reject){
    reject({error: errMsg});
  }));

  this.set('session.authenticate', authenticate);

  this.render(hbs`{{sign-in-form}}`);

  let $btn = this.$('.SignInForm-submitButton');
  $btn.click();

  return wait().then( ()=>{
    let $emailField = this.$('.SignInForm-emailInput');
    let $passwordField = this.$('.SignInForm-passwordInput');
    assert.ok($emailField.parent().hasClass('has-error'),
      "Email field has error state"
    );

    assert.equal($emailField.next().text(), errMsg,
      "Displays error message next to email"
    );

    assert.ok($passwordField.parent().hasClass('has-error'),
      "Password field has error state"
    );
  });
});
