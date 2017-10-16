import Ember from 'ember';
import NewsCard from '../news-card/component';

const {
  get,
  computed
} = Ember;

export default NewsCard.extend({
  'data-test-component': 'NewsCard',
  'data-test-content': computed.reads('item.id'),
  tagName: 'article',
  item: null,
  variant: null,
  classNameBindings: ['isFullImageCover:Card--fullImageCover', 'isWithoutImage:Card--withoutImage'],

  isFullImageCover: computed('variant', 'item', function() {
    const isFullImageCover = get(this, 'variant') === 'full';
    const hasImage = get(this, 'item.imageUrl');

    return isFullImageCover && hasImage;
  }),

  isWithoutImage: computed('item.imageUrl', function() {
    return !get(this, 'item.imageUrl');
  }),

  linkRoute: computed('item.organization.bizFeedActive', function() {
    const bizFeedActive = get(this, 'item.organization.bizFeedActive');
    return bizFeedActive ? 'biz.show' : 'organization-profile';
  }),

  linkId: computed('item.organization.bizFeedActive', function() {
    const bizFeedActive = get(this, 'item.organization.bizFeedActive');
    return bizFeedActive ? get(this, 'item.organization.id') : get(this, 'item.organization.slug');
  }),

  actions: {
    trackClick() {
      const clickAction = get(this, 'trackClick');
      if(clickAction) {
        clickAction();
      }

      return true;
    }
  }
});
