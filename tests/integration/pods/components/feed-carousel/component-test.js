import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'ember-test-selectors';
/* global Ember, sinon */

function makeListservCarousel(numberOfCards) {
  let listservContents = [];

  for (var i=0; i<numberOfCards; i++) {
    listservContents.push({
      id: i+1,
      contentOrigin: 'listserv',
      isListserv: true,
      normalizedContentType: 'listserv'
    });
  }

  const listservCarousel = {
    id: 1,
    title: 'Local Listserv',
    carouselType: 'content',
    queryParams: {"organization_id": 447},
    contents: listservContents,
    isContentCarousel: true
  };

  return listservCarousel;
}

moduleForComponent('feed-carousel', 'Integration | Component | feed carousel', {
  integration: true,
  beforeEach() {
    const routingStub = Ember.Service.extend({
      transitionTo: sinon.stub(),
      hasRoute() {
        return true;
      },
      generateURL() {
        return "";
      }
    });

    this.register('service:-routing', routingStub);
    this.inject.service('-routing', { as: 'routing' });

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

test('feed-carousel fires correct tracking events', function(assert) {
  assert.expect(11);

  const { spy } = sinon;

  var carouselTrackingSpy = spy(),
      cardTrackingSpy = spy();

  const trackingService = Ember.Service.extend({
    trackCarouselEvent: carouselTrackingSpy,
    trackCarouselCardClickEvent: cardTrackingSpy
  });
  this.register('service:tracking', trackingService);
  this.inject.service('tracking', { as: 'tracking' });

  const listservCarousel = makeListservCarousel(5);

  this.set('model', listservCarousel);

  this.render(hbs`{{feed-carousel
    model=model
    isLoggedIn=false
  }}`);

  assert.ok(carouselTrackingSpy.calledOnce, 'it fires a tracking event once on load');
  assert.equal(carouselTrackingSpy.args[0][0], 'Impression', 'tracking event is an Impression');
  assert.equal(carouselTrackingSpy.args[0][1], this.get('model.id'), 'tracking impression event sends the correct carousel id');
  assert.equal(carouselTrackingSpy.args[0][2], this.get('model.carouselType'), 'tracking impression event sends the correct carousel type');

  let $feedCarouselCtaCard = this.$(testSelector('feed-carousel-cta-card'));

  $feedCarouselCtaCard.find('a.FeedCarousel-CtaCard-link').click();
  assert.equal(carouselTrackingSpy.args[1][0], 'ClickedSeeMore', 'tracking event is an ClickedSeeMore');
  assert.equal(carouselTrackingSpy.args[1][1], this.get('model.id'), 'tracking cta click event sends the correct carousel id');

  let $feedCarouselCard = this.$(testSelector('feed-carousel-card')).first();

  assert.equal($feedCarouselCard.find('div.FeedCarousel-ContentCard-title a').length, 0, 'Card title should not be clickable when not logged in');

  this.render(hbs`{{feed-carousel
    model=model
    isLoggedIn=true
  }}`);

  $feedCarouselCard = this.$(testSelector('feed-carousel-card')).first();
  let $cardLink = $feedCarouselCard.find('div.FeedCarousel-ContentCard-title a');

  assert.ok($cardLink.length, 'Card title should be clickable when logged in');

  $cardLink.click();
  assert.equal(cardTrackingSpy.args[0][0], 'title', 'tracking event shows correct elemeent');
  assert.equal(cardTrackingSpy.args[0][1], this.get('model.id'), 'tracking card click event sends the correct carousel id');
  assert.equal(cardTrackingSpy.args[0][2], this.get('model.contents')[0].id, 'tracking card click event sends the correct content id');
});

test('feed-carousel displays cards and no cta if fewer than 5 cards present', function(assert) {
  assert.expect(2);

  let listservCarousel = makeListservCarousel(2);

  this.set('model', listservCarousel);

  this.render(hbs`{{feed-carousel model=model}}`);

  let $feedCarouselCards = this.$(testSelector('feed-carousel-card'));
  assert.ok($feedCarouselCards.length === 2, "should show two cards");

  let $feedCarouselCtaCard = this.$(testSelector('feed-carousel-cta-card'));
  assert.ok($feedCarouselCtaCard.length === 0, "should not show cta card when less than 5 cards are displayed");
});

test('feed-carousel displays cards and cta if 5 or more cards present', function(assert) {
  assert.expect(3);

  let listservCarousel = makeListservCarousel(5);

  this.set('model', listservCarousel);

  this.render(hbs`{{feed-carousel model=model}}`);

  let $feedCarouselCards = this.$(testSelector('feed-carousel-card'));
  assert.ok($feedCarouselCards.length === 5, "should show five cards");

  let $feedCarouselCtaCard = this.$(testSelector('feed-carousel-cta-card'));
  assert.ok($feedCarouselCtaCard.length === 1, "should show cta card when 5 or more cards are displayed");

  let $feedCarouselInlineCta = this.$(testSelector('feed-carousel-inline-cta'));
  assert.ok($feedCarouselInlineCta.length === 1, "should show inline cta when 5 or more cards are displayed");
});
