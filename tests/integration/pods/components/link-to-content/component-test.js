import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
/* global sinon */

moduleForComponent('link-to-content', 'Integration | Component | link to content', {
  integration: true,

  beforeEach() {
    const routingStub = Ember.Service.extend({
      transitionTo: sinon.spy(),
      hasRoute() {
        return true;
      },
      generateURL() {
        return "";
      }
    });

    this.register('service:-routing', routingStub);
    this.inject.service('-routing', { as: 'routing' });
  }
});

test('given a non-event model', function(assert) {
  const model = {id: 1, contentId: 123};

  this.setProperties({
    model
  });

  // Template block usage:
  this.render(hbs`
    {{#link-to-content model}}
      click here
    {{/link-to-content}}
  `);

  this.$('a').click();

  assert.ok(
    this.routing.transitionTo.calledWith('feed.show', [model.contentId]),
    "It links to the feed show route"
  );
});

test('given an event model', function(assert) {
  const model = {id: 1, contentId: 123, eventInstanceId: 444};

  this.setProperties({
    model
  });

  // Template block usage:
  this.render(hbs`
    {{#link-to-content model}}
      click here
    {{/link-to-content}}
  `);

  this.$('a').click();

  assert.ok(
    this.routing.transitionTo.calledWith('feed.show-instance', [model.contentId, model.eventInstanceId]),
    "It links to the feed show instance route"
  );
});

test('given a clickOverride action', function(assert) {
  const model = {id: 1, contentId: 123};
  const clickAction = sinon.spy();

  this.setProperties({
    model,
    clickAction
  });

  // Template block usage:
  this.render(hbs`
    {{#link-to-content model clickOverride=(action clickAction)}}
      click here
    {{/link-to-content}}
  `);

  this.$('a').click();

  assert.ok(
    this.routing.transitionTo.notCalled,
    "It does not transition"
  );

  assert.ok(
    clickAction.called,
    "Click action is called"
  );
});
