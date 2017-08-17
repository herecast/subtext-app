import Ember from 'ember';

const { get, set, computed } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-MarketInfo',

  images: [],
  cost: null,
  activeImageUrl: null,

  hasMultipleImages: computed.gt('images.length', 1),

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
