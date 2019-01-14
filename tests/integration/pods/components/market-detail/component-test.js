import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

const contentCommentsStub = Service.extend({
  getComments() { }
});

module('Integration | Component | market detail', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.tracking = this.owner.lookup('service:tracking');
    this.owner.register('service:content-comments', contentCommentsStub);
  });

  test('it renders', async function(assert) {
    this.set('scrollToMock', () => {});
    this.set('model', {id: 1, images: []});

    await render(hbs`
      {{market-detail
        model=model
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

    this.set('market', {
      id: 1,
      contentId: 2,
      images: []
    });
    this.set('scrollToMock', () => {});

    await render(hbs`
      {{market-detail
        model=market
        scrollTo=(action scrollToMock)
      }}
    `);

      assert.ok(
        impressions.indexOf(2) > -1,
        'After render, records impression through tracking service');

      this.set('market', {
        id: 4,
        contentId: 5,
        images: []
      });

      assert.ok(
        impressions.indexOf(5) > -1,
        'it records a new impression when given a new model');
  });
});
