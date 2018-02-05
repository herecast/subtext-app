import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleForComponent('feed-card', 'Integration | Component | feed card', {
  integration: true,
  beforeEach() {
    this.register('service:feature-flags', Ember.Service.extend({}));
    this.register('service:user-location', Ember.Service.extend({
      locationId: 0,
      location: {
        name: "",
        id: 0
      },
      on(){},
    }));
  }
});

const model = {
  id: 1,
  modelType: 'news',
  title: 'God rest ye merry gentlemen!',
  normalizedContentType: 'news',
  baseLocations: []
};

test('impression event', function(assert) {
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

  document.getElementById('ember-testing-container').scrollIntoView();

  this.set('trackingService', trackingService);

  this.render(hbs`{{feed-card
    model=model
    tracking=trackingService
  }}`);

  return wait().then(()=>{
  });
});

test('impression scroll', function(assert) {
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

  document.getElementById('ember-testing-container').scrollIntoView();

  this.render(hbs`
  <div style="height: 125vh; background-color: black;"></div>
  {{feed-card
    model=model
    tracking=trackingService
  }}`);


  return wait().then(()=>{
    assert.equal(impressions, 0,
      "impression tracking was not fired because the tile is out of the viewport");

    const $feedCard = this.$('[data-test-feed-card]')[0];
    $feedCard.scrollIntoView();

    const testWaiter = function() {
      return this.$('[data-test-entered-viewport]').length > 0;
    };
    
    Ember.Test.registerWaiter(this, testWaiter);

    return wait().then(()=>{
      Ember.Test.unregisterWaiter(this, testWaiter);

      assert.equal(impressions, 1,
        "Impression event fired when tile is scrolled into view");

      window.scrollTo(0,0);
      document.getElementById('ember-testing-container').scrollTop = 0;

      return wait().then(()=>{
        $feedCard.scrollIntoView();
        return wait().then(()=>{
          assert.equal(
            impressions, 1,
            "Scrolling away, and back does not trigger another impression");
          done();
        });
      });
    });
  });
});
