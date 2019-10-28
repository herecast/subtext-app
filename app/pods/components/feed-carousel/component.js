import { alias, gt, gte, or } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { isBlank, isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'FeedCarousel',

  model: null,
  isSearchActive: false,
  hasSlid: false,

  session: service(),
  tracking: service(),
  userLocation: service(),

  feedRoute: 'feed',
  profileRoute: 'profile.all',

  isContentCarousel: alias('model.isContentCarousel'),
  carouselId: alias('model.id'),
  carouselType: alias('model.carouselType'),

  isLoggedIn: alias('session.isAuthenticated'),
  linkLocation: alias('userLocation.selectedOrDefaultLocationId'),


  hasCards: gt('cards.length', 0),
  showCtaCard: gte('cards.length', 5),
  hasTitle: gt('carouselTitle.length', 0),
  showTitleBar: or('hasTitle', 'showCtaCard'),

  componentName: computed('carouselType', function() {
    let cardType;
    let carouselType = get(this, 'carouselType').dasherize();

    if (isBlank(carouselType)) {
      cardType = 'content';
    } else {
      cardType = carouselType;
    }

    return `feed-carousel/${cardType}-card`;
  }),

  cards: computed('model', 'isContentCarousel', function() {
    const model = get(this, 'model');

    if ( get(this, 'isContentCarousel') ) {
      return get(model, 'contents');
    }
  }),

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

  ctaRouteName: alias('feedRoute'),

  linkToFeed: computed('ctaRouteName', function() {
    return get(this, 'ctaRouteName') === get(this, 'feedRoute');
  }),

  queryParams: alias('model.queryParams'),

  didInsertElement() {
    get(this, 'tracking').trackCarouselEvent('Impression', get(this, 'carouselId'), get(this, 'carouselType'));
  },

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
