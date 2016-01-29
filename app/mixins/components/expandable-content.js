import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get } = Ember;

export default Ember.Mixin.create(TrackEvent, {
  showAll: false,
  limit: 3,
  content: [],

  contentToDisplay: function() {
    const allContent = this.get('content');

    if (this.get('showAll')) {
      return allContent;
    } else {
      return allContent.slice(0, this.get('limit'));
    }
  }.property('content.[]', 'showAll'),

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
