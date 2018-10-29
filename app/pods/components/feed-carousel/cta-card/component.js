import Component from '@ember/component';

export default Component.extend({
  classNames: 'FeedCarousel-CtaCard',
  attributeBindings: ['showDataTest:data-test-feed-carousel-cta-card'],
  showDataTest: true,

  onClickAction: function() {},

  linkToFeed: false,
  linkToProfile: false,
  linkLocation: null,
  ctaRouteName: null,
  profileId: null,
  queryParams: null,
  seeMoreText: null,
});
