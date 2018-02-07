import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCarousel-ContentCard',
  classNameBindings: ['isListservCard:is-listserv-card'],
  'data-test-feed-carousel-card': computed.oneWay('model.normalizedContentType'),

  model: null,
  carouselId: null,
  isLoggedIn: false,

  tracking: service(),

  isListservCard: computed.readOnly('model.isListserv'),

  linkIsActive: computed('isListservCard', 'isLoggedIn', function() {
    if (get(this, 'isListservCard')) {
      return get(this, 'isLoggedIn');
    }

    return true;
  }),

  title: computed.alias('model.title'),

  body: computed.alias('model.content'),

  actions: {
    onLinkClick(elementName) {
      get(this, 'tracking').trackCarouselCardClickEvent(elementName, get(this, 'carouselId'), get(this, 'model.id'));
    }
  }
});
