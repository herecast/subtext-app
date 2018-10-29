import Service from '@ember/service';
import EmberObject, { get } from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import moment from 'moment';

const contentCommentsStub = Service.extend({
  getComments() { }
});

module('Integration | Component | event detail', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.tracking = this.owner.lookup('service:tracking');
    this.owner.register('service:content-comments', contentCommentsStub);
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('scrollToMock', () => {});
    this.set('eventInstance', {startsAt: moment()});
    this.set('content', {futureInstances: [get(this, 'eventInstance')]});

    await render(hbs`
     {{event-detail
        model=content
        scrollTo=(action scrollToMock)
     }}
    `);

    assert.ok(this.element.textContent.trim());
  });

  test('Tracking impressions', async function(assert) {
    assert.expect(2);

    let impressions = [];

    this.tracking.reopen({
      contentImpression(id) {
        impressions.push(id);
      }
    });

    this.set('event', EmberObject.create({
      id: 1,
      contentId: 2,
      futureInstances: []
    }));
    this.set('scrollToMock', () => {});
    this.set('contentMock', ()=>{});

    await render(hbs`
      {{event-detail
        content=contentMock
        model=event
        scrollTo=(action scrollToMock)
      }}
    `);

      assert.ok(
        impressions.indexOf(2) > -1,
        'After render, records impression through tracking service');

    this.set('event', EmberObject.create({
      id: 4,
      contentId: 5,
      futureInstances: []
    }));

      assert.ok(
        impressions.indexOf(5) > -1,
        'it records a new impression when given a new model');
  });
});
