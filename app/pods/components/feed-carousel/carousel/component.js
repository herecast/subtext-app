import Ember from 'ember';

const { get, set, computed, isPresent, isBlank, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCarousel-Carousel',

  model: null,
  isSearchActive: false,

  tracking: service(),
  hasSlid: false,

  didInsertElement() {
    get(this, 'tracking').trackCarouselEvent('Impression', get(this, 'carouselId'));
  },

  carouselType: computed.alias('model.carouselType'),
  carouselId: computed.alias('model.id'),

  isOrganizationCarousel: computed.equal('carouselType', 'organization'),

  isFeedContentCarousel: computed.equal('carouselType', 'feed-content'),

  carouselTitle: computed('model.title', 'isSearchActive', function() {
    const title = get(this, 'model.title');
    const isSearchActive = get(this, 'isSearchActive');

    let carouselTitle = '';

    if (isPresent(title)) {
      if (isSearchActive) {
        carouselTitle = `${title} Matching Your Search`;
      } else {
        carouselTitle = title;
      }
    }

    return carouselTitle;
  }),

  seeMoreText: computed('carouselTitle', function() {
    const carouselTitle = get(this, 'carouselTitle');

    return isPresent(carouselTitle) ? carouselTitle : 'Results';
  }),

  queryParams: computed('model.queryParams', function() {
    let queryParams = get(this, 'model.queryParams');

    //Temp hard-code until back end supports
    if (isBlank(queryParams) && get(this, 'isOrganizationCarousel')) {
      queryParams = {
        "type": "organization"
      };
    }

    return queryParams;
  }),

  cards: computed('model', 'isOrganizationCarousel', 'isFeedContentCarousel', function() {
    const model = get(this, 'model');

    if ( get(this, 'isOrganizationCarousel') ) {
      return get(model, 'organizations');
    } else if ( get(this, 'isFeedContentCarousel') ) {
      return get(model, 'feedContents');
    }
  }),

  hasCards: computed.gt('cards.length', 0),

  actions: {
    onChange() {
      if (!get(this, 'hasSlid')) {
        get(this, 'tracking').trackCarouselEvent('Sliding', get(this, 'carouselId'));
        set(this, 'hasSlid', true);
      }
    },

    onClickSeeMore() {
      get(this, 'tracking').trackCarouselEvent('ClickedSeeMore', get(this, 'carouselId'));
    }
  }
});
