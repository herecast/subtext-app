import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render , click} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

function makeContentCarousel(numberOfCards) {
  let contents = [];

  for (var i=0; i<numberOfCards; i++) {
    contents.push({
      id: i+1,
      contentOrigin: 'ugc',
      contentType: 'news'
    });
  }

  const contentCarousel = {
    id: 1,
    title: 'Local Content',
    carouselType: 'content',
    contents: contents,
    isContentCarousel: true
  };

  return contentCarousel;
}

module('Integration | Component | feed carousel', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    const routingStub = Service.extend({
      transitionTo: sinon.stub(),
      hasRoute() {
        return true;
      },
      generateURL() {
        return "";
      }
    });

    this.owner.register('service:router', routingStub);
    this.router = this.owner.lookup('service:router');

    this.owner.register('service:user-location', Service.extend({
      userLocationId: 0,
      userLocation: {
        id: 0
      },
      on(){},
      off(){}
    }));
  });

  test('feed-carousel fires correct tracking events', async function(assert) {
    assert.expect(6);

    const { spy } = sinon;

    var carouselTrackingSpy = spy(),
        cardTrackingSpy = spy();

    const trackingService = Service.extend({
      trackCarouselEvent: carouselTrackingSpy,
      trackCarouselCardClickEvent: cardTrackingSpy
    });
    this.owner.register('service:tracking', trackingService);
    this.tracking = this.owner.lookup('service:tracking');

    const carousel = makeContentCarousel(5);

    this.set('model', carousel);

    await render(hbs`{{feed-carousel
      model=model
      isLoggedIn=false
    }}`);

    assert.ok(carouselTrackingSpy.calledOnce, 'it fires a tracking event once on load');
    assert.equal(carouselTrackingSpy.args[0][0], 'Impression', 'tracking event is an Impression');
    assert.equal(carouselTrackingSpy.args[0][1], this.get('model.id'), 'tracking impression event sends the correct carousel id');
    assert.equal(carouselTrackingSpy.args[0][2], this.get('model.carouselType'), 'tracking impression event sends the correct carousel type');

    await click('[data-test-feed-carousel-cta-card-action]');

    assert.equal(carouselTrackingSpy.args[1][0], 'ClickedSeeMore', 'tracking event is an ClickedSeeMore');
    assert.equal(carouselTrackingSpy.args[1][1], this.get('model.id'), 'tracking cta click event sends the correct carousel id');
  });

  test('feed-carousel displays cards and no cta if fewer than 5 cards present', async function(assert) {
    assert.expect(2);

    let carousel = makeContentCarousel(2);

    this.set('model', carousel);

    await render(hbs`{{feed-carousel model=model}}`);

    let $feedCarouselCards = this.element.querySelectorAll('[data-test-feed-carousel-card]');
    assert.ok($feedCarouselCards.length === 2, "should show two cards");

    let $feedCarouselCtaCard = this.element.querySelector('[data-test-feed-carousel-cta-card]');
    assert.notOk($feedCarouselCtaCard, "should not show cta card when less than 5 cards are displayed");
  });

  test('feed-carousel displays cards and cta if 5 or more cards present', async function(assert) {
    assert.expect(3);

    let carousel = makeContentCarousel(5);

    this.set('model', carousel);

    await render(hbs`{{feed-carousel model=model}}`);

    let $feedCarouselCards = this.element.querySelectorAll('[data-test-feed-carousel-card]');
    assert.ok($feedCarouselCards.length === 5, "should show five cards");

    let $feedCarouselCtaCard = this.element.querySelector('[data-test-feed-carousel-cta-card]');
    assert.ok($feedCarouselCtaCard, "should show cta card when 5 or more cards are displayed");

    let $feedCarouselInlineCta = this.element.querySelector('[data-test-feed-carousel-inline-cta]');
    assert.ok($feedCarouselInlineCta, "should show inline cta when 5 or more cards are displayed");
  });
});
