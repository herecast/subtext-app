import Ember from 'ember';
import { skip } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
/* global sinon */

window.Intercom = sinon.stub();

let intercom = Ember.Service.extend({
  doNotTrack: sinon.stub(),
  doTrack: sinon.stub(),
  update: sinon.stub(),
  boot: sinon.stub()
});

moduleForAcceptance('Acceptance | edit requires canEdit flag', {
  beforeEach() {
    this.application.register('service:intercomTest', intercom);
    this.application.inject('route', 'intercom', 'service:intercomTest');

    server.create('location');
    authenticateUser(this.application,server);
  }
});

/* NEWS */
skip('visit edit news page when not allowed to edit', function(assert) {
  const organization = server.create('organization');
  const news = server.create('news', {
    organization: organization,
    canEdit: false
  });

  let newsUrl = `/news/${news.id}/edit`;
  visit(newsUrl).then(()=> {
    assert.notOk(find(testSelector('component', 'NewsEditor')).length,
      "should not see news editor");
  });
});

skip('visit edit news page when allowed to edit', function(assert) {
  const organization = server.create('organization');
  const news = server.create('news', {
    organization: organization,
    canEdit: true
  });

  let newsUrl = `/news/${news.id}/edit`;
  visit(newsUrl).then(()=> {
    assert.ok(find(testSelector('component', 'NewsEditor')).length,
      "should see news editor");
  });
});

/* MARKET */
skip('visit edit market page when not allowed to edit', function(assert) {
  const post = server.create('marketPost', {
    canEdit: false
  });

  let postUrl = `/market/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.notOk(find(testSelector('component', 'MarketForm')).length,
      "should not see market form");
  });
});

skip('visit edit market page when allowed to edit', function(assert) {
  const post = server.create('marketPost', {
    canEdit: true
  });

  let postUrl = `/market/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.ok(find(testSelector('component', 'MarketForm')).length,
      "should see market form");
  });
});

/* EVENTS */
skip('visit edit event page when not allowed to edit', function(assert) {
  const post = server.create('event', {
    canEdit: false
  });

  let postUrl = `/events/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.notOk(find(testSelector('component', 'EventForm')).length,
      "should not see event form");
  });
});

skip('visit edit event page when allowed to edit', function(assert) {
  const post = server.create('event', {
    canEdit: true
  });

  let postUrl = `/events/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.ok(find(testSelector('component', 'EventForm')).length,
      "should see event form");
  });
});
