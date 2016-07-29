import Ember from 'ember';
import NewsCard from '../news-card/component';

const {
  get,
  computed
} = Ember;

export default NewsCard.extend({
  item: null,
  classNameBindings: ['isFullImageCover:Card--fullImageCover', 'isWithoutImage:Card--withoutImage'],

  isFullImageCover: computed('variant', 'item', function() {
    const isFullImageCover = get(this, 'variant') === 'full';
    const hasImage = get(this, 'item.imageUrl');

    return isFullImageCover && hasImage;
  }),

  isWithoutImage: computed('item.imageUrl', function() {
    return !get(this, 'item.imageUrl');
  })
});
