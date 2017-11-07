/* global sinon */
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'subtext-ui/tests/helpers/start-app';

var application;

let doNotTrack = sinon.spy();
let doTrack = sinon.spy();

let intercom = Ember.Service.extend({
  doNotTrack: doNotTrack,
  doTrack: doTrack
});

module('Acceptance | intercom, lists', {
  beforeEach: function() {
    application = startApp();

    application.register('service:intercomTest', intercom);

    application.inject('route', 'intercom', 'service:intercomTest');

  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting a lists/ subroute will disable intercom tracking', function(assert) {

  let listserv = server.create('listserv');
  let lc = server.create('listservContent', {user_id: null, listserv_id: listserv.id});

  visit(`/lists/posts/${lc.id}`).then(()=> {
    assert.ok(doNotTrack.called);
  });
});

test('leaving lists/ subroute will reactiveate intercom tracking', function(assert) {
  let listserv = server.create('listserv');
  let lc = server.create('listservContent', {user_id: null, listserv_id: listserv.id});

  visit(`/lists/posts/${lc.id}`).then(()=> {
    visit('/').then(()=>{
      assert.ok(doTrack.called);
    });
  });
});
