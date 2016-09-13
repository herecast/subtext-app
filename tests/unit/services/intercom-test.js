/* global sinon */
import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import config from 'subtext-ui/config/environment';

moduleFor('service:intercom', 'Unit | Service | intercom', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});

test('boot(user)', function(assert){
  window.Intercom = sinon.spy();

  let user = Ember.Object.create({
    email: 'test@test.com',
    name: 'test user',
    userId: 1,
    createdAt: (new Date()),
    testGroup: 'TEST GROUP'
  });

  let service = this.subject();
  service.boot(user);

  assert.ok(window.Intercom.calledWith('boot', {
    app_id: config['intercom-api-token'],
    email: 'test@test.com',
    name: 'test user',
    user_id: 1,
    created_at: user.get('createdAt'),
    test_group: 'TEST GROUP',
    widget: {
      activator: '#IntercomDefaultWidget'
    }
  }));
});

test('When intercom tracking disabled; boot(user)', function(assert){
  window.Intercom = sinon.spy();

  let user = Ember.Object.create({
    email: 'test@test.com',
    name: 'test user',
    userId: 1,
    createdAt: (new Date()),
    testGroup: 'TEST GROUP'
  });

  let service = this.subject();
  service.doNotTrack();
  service.boot(user);

  assert.notOk(window.Intercom.calledWith('boot'));
});
