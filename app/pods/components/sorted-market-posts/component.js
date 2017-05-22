import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  marketPosts: [],

  sortedPosts: computed.alias('marketPosts'),

  actions: {
    trackCardClick() {
      const trackCardClick = get(this, 'trackCardClick');
      if (trackCardClick) {
        trackCardClick();
      }
    }
  }
});
