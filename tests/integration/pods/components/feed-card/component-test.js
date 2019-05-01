import { registerWaiter, unregisterWaiter } from '@ember/test';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

module('Integration | Component | feed card', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:feature-flags', Service.extend({}));
    this.owner.register('service:user-location', Service.extend({
      locationId: 0,
      location: {
        name: "",
        id: 0
      },
      on(){},
      off(){}
    }));
  });

  const model = {
    id: 1,
    modelType: 'news',
    title: 'God rest ye merry gentlemen!',
    contentType: 'news',
    baseLocations: []
  };

  test('impression event', async function(assert) {
    const done = assert.async();

    this.set('model', model);

    const trackingService = {
      trackTileImpression() {
        assert.ok(
          true,
          "impression tracking was fired for the tile when it rendered");
        done();
      }
    };

     $(document).find('#ember-testing-container')[0].scrollIntoView();

    this.set('trackingService', trackingService);

    await render(hbs`{{feed-card
      model=model
      tracking=trackingService
    }}`);

    return settled().then(()=>{
    });
  });

  test('impression scroll', async function(assert) {
    const done = assert.async(2);
    let impressions = 0;

    this.set('model', model);

    const trackingService = {
      trackTileImpression() {
        impressions = impressions+1;
        done();
      }
    };

    this.set('trackingService', trackingService);

    $(document).find('#ember-testing-container')[0].scrollIntoView();

    await render(hbs`
    <div style="height: 125vh; background-color: black;"></div>
    {{feed-card
      model=model
      tracking=trackingService
    }}`);


    return settled().then(()=>{
      assert.equal(impressions, 0,
        "impression tracking was not fired because the tile is out of the viewport");

      const $feedCard = $('[data-test-feed-card]')[0];
      $feedCard.scrollIntoView(false);

      const testWaiter = function() {
        return this.element.querySelectorAll('[data-test-entered-viewport]').length > 0;
      };

      registerWaiter(this, testWaiter);

      return settled().then(()=>{
        unregisterWaiter(this, testWaiter);

        assert.equal(impressions, 1,
          "Impression event fired when tile is scrolled into view");

        window.scrollTo(0,0);
         $(document).find('#ember-testing-container')[0].scrollTop = 0;

        return settled().then(()=>{
          $feedCard.scrollIntoView(false);
          return settled().then(()=>{
            assert.equal(
              impressions, 1,
              "Scrolling away, and back does not trigger another impression");
            done();
          });
        });
      });
    });
  });
});
