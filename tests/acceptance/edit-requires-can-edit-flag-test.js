import Service from '@ember/service';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { visit } from '@ember/test-helpers';
import sinon from 'sinon';

window.Intercom = sinon.stub();

let intercom = Service.extend({
  doNotTrack: sinon.stub(),
  doTrack: sinon.stub(),
  update: sinon.stub(),
  boot: sinon.stub()
});

module('Acceptance | edit requires canEdit flag', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.application.register('service:intercomTest', intercom);
    this.application.inject('route', 'intercom', 'service:intercomTest');

    this.server.create('location');
    authenticateUser(this.server);
  });

  /* NEWS */
  skip('visit edit news page when not allowed to edit', function(assert) {
    const organization = this.server.create('organization');
    const news = this.server.create('news', {
      organization: organization,
      canEdit: false
    });

    let newsUrl = `/news/${news.id}/edit`;
    visit(newsUrl).then(()=> {
      assert.notOk(find('[data-test-component="NewsEditor"]').length,
        "should not see news editor");
    });
  });

  skip('visit edit news page when allowed to edit', function(assert) {
    const organization = this.server.create('organization');
    const news = this.server.create('news', {
      organization: organization,
      canEdit: true
    });

    let newsUrl = `/news/${news.id}/edit`;
    visit(newsUrl).then(()=> {
      assert.ok(find('[data-test-component="NewsEditor"]').length,
        "should see news editor");
    });
  });

  /* MARKET */
  skip('visit edit market page when not allowed to edit', function(assert) {
    const post = this.server.create('marketPost', {
      canEdit: false
    });

    let postUrl = `/market/${post.id}/edit`;
    visit(postUrl).then(()=> {
      assert.notOk(find('[data-test-component="MarketForm"]').length,
        "should not see market form");
    });
  });

  skip('visit edit market page when allowed to edit', function(assert) {
    const post = this.server.create('marketPost', {
      canEdit: true
    });

    let postUrl = `/market/${post.id}/edit`;
    visit(postUrl).then(()=> {
      assert.ok(find('[data-test-component="MarketForm"]').length,
        "should see market form");
    });
  });

  /* EVENTS */
  skip('visit edit event page when not allowed to edit', function(assert) {
    const post = this.server.create('event', {
      canEdit: false
    });

    let postUrl = `/events/${post.id}/edit`;
    visit(postUrl).then(()=> {
      assert.notOk(find('[data-test-component="EventForm"]').length,
        "should not see event form");
    });
  });

  skip('visit edit event page when allowed to edit', function(assert) {
    const post = this.server.create('event', {
      canEdit: true
    });

    let postUrl = `/events/${post.id}/edit`;
    visit(postUrl).then(()=> {
      assert.ok(find('[data-test-component="EventForm"]').length,
        "should see event form");
    });
  });
});
