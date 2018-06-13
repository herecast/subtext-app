import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCarousel-ContentCard',
  'data-test-feed-carousel-card': computed.oneWay('model.contentType'),

  model: null,
  carouselId: null,
  linkIsActive: true,

  tracking: service(),

  title: computed.alias('model.title'),

  body: computed.alias('model.content'),

  actions: {
    onLinkClick(elementName) {
      get(this, 'tracking').trackCarouselCardClickEvent(elementName, get(this, 'carouselId'), get(this, 'model.id'));
    }
  }
});
