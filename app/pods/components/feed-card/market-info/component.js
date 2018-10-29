import { gt } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  classNames: 'FeedCard-MarketInfo',

  cost: null,
  activeImageUrl: null,
  showPrice: true,

  images: A(),

  hasMultipleImages: gt('images.length', 1),

  price: computed('cost', function() {
    const cost = get(this, 'cost') || '';

    return (cost.length > 0 && cost.length < 20 ) ? cost : 'See details';
  }),

  actions: {
    changeActiveImageUrl(url) {
      set(this, 'activeImageUrl', url);
    }
  }
});
