import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, computed } = Ember;

export default Ember.Mixin.create(TrackEvent, {
  showAll: false,
  limit: 3,
  content: [],

  contentToDisplay: computed('content.[]', 'showAll', function() {
    const allContent = this.get('content');

    if (this.get('showAll')) {
      return allContent;
    } else {
      return allContent.slice(0, this.get('limit'));
    }
  }),

  hasMore: computed('content.[]', 'limit', function() {
    return get(this, 'content.length') > get(this, 'limit');
  }),

  actions: {
    toggleMore() {
      const moreOrLess = (get(this, 'showAll')) ? 'less' : 'more';

      this.trackEvent('selectNavControl', {
        navControlGroup: 'Similar Content View',
        navControl: `view ${moreOrLess}`
      });

      this.toggleProperty('showAll');
    }
  }
});
