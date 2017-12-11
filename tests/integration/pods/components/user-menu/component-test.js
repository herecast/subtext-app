import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import testSelector from 'ember-test-selectors';

/* global sinon */


const mockSession = Ember.Service.extend({
  invalidate: sinon.spy()
});

moduleForComponent('user-menu', 'Integration | Component | user menu', {
  integration: true,
  setup() {
    this.register('service:session', mockSession);
    this.inject.service('session');
  }
});


test('Given a user, it renders', function(assert) {
  let user =  {
    name: 'My Name',
    userImageUrl: 'http://go.test/user-image.jpg'
  };

  this.set('currentUser', user);

  this.render(hbs`{{user-menu model=currentUser}}`);

  let $userName = this.$(testSelector('user-menu-name'));
  let $logoutLink = this.$(testSelector('link', 'logout-link'));
  let $myAccountLink = this.$(testSelector('link', 'my-account-link'));
  let $dashboardLink = this.$(testSelector('link', 'manage-content-link'));

  assert.ok($userName.text().trim().indexOf(user.name) >= 0,
    'It displays user name'
  );

  assert.ok($logoutLink.length,
    'It has a logout link'
  );

  assert.ok($myAccountLink.length,
    'It has a my account link'
  );

  assert.ok($dashboardLink.length,
    'It has a dashboard link'
  );
});

test('my account link - given a openMyAccount action', function(assert) {

  let user =  {
    name: 'My Name',
    userImageUrl: 'http://go.test/user-image.jpg',
  };

  this.set('currentUser', user);

  let openMyAccount = sinon.spy();
  this.set('myAccountAction', openMyAccount);

  this.render(hbs`{{user-menu model=currentUser openMyAccount=(action myAccountAction)}}`);

  this.$('.UserMenu-myAccount').click();

  assert.ok(openMyAccount.calledWith(user),
    'Calls openMyAccount action'
  );
});

test('sign out link - invalidates session', function(assert) {

  let user =  {
    name: 'My Name',
    userImageUrl: 'http://go.test/user-image.jpg',
  };

  this.set('currentUser', user);

  this.render(hbs`{{user-menu model=currentUser}}`);

  this.$('.UserMenu-logout').click();

  assert.ok(this.session.invalidate.called,
    'Invalidates session'
  );
});

test('User has organizations, organization dashboard links', function(assert) {

  let organizations = [
    {
      id: 1,
      name: 'Org 1',
      logoUrl: 'http://go.test/this.jpg'
    },
    {
      id: 2,
      name: 'Org 2',
      logoUrl: 'http://go.test/this2.jpg'
    }
  ];

  let user =  {
    name: 'My Name',
    userImageUrl: 'http://go.test/user-image.jpg',
    managedOrganizations: organizations
  };

  this.set('currentUser', user);

  this.render(hbs`{{user-menu model=currentUser}}`);

  assert.equal(this.$(testSelector('component', 'organization-menu-item')).length, 2);
});
