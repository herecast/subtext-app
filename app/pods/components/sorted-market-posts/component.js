import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  marketPosts: [],

  marketPostsSort: ['publishedAt:desc'],
  sortedPosts: computed.sort('marketPosts', 'marketPostsSort'),

  actions: {
    trackCardClick() {
      const trackCardClick = get(this, 'trackCardClick');
      if (trackCardClick) {
        trackCardClick();
      }
    }
  }
});
