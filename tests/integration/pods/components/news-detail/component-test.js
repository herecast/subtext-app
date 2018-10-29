import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const promotionStub = Service.extend({
  find() {
    return { then() {} };
  }
});

const adStub = Service.extend({
  getAd() {
   return { then() {} };
  }
});

module('Integration | Component | news detail', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:promotion', promotionStub);
    this.owner.register('service:ads', adStub);
    this.promotion = this.owner.lookup('service:promotion');
    this.tracking = this.owner.lookup('service:tracking');
  });


  test('it renders', async function(assert) {
    assert.expect(1);
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
    this.set('news', {id: 1});
    this.set('scrollToMock', () => {});

    await render(hbs`
      {{news-detail
        model=news
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

    this.set('news', {id: 1});
    this.set('scrollToMock', () => {});

    await render(hbs`
      {{news-detail
        attr=attr
        model=news
        scrollTo=(action scrollToMock)
      }}
    `);

      assert.ok(
        impressions.indexOf(1) > -1,
        'After render, records impression through tracking service');

      this.set('news', {id: 2});
      assert.ok(
        impressions.indexOf(2) > -1,
        'it records a new impression when given a new model');
  });
});
