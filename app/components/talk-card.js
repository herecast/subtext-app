import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';

const { get } = Ember;

export default Ember.Component.extend(TrackCard, {
  title: Ember.computed.oneWay('talk.title'),
  isContentCard: false,
  isSimilarContent: false,
  classNameBindings: ['hasComments:TalkCard--stacked'],

  hasComments: Ember.computed.gt('talk.commentCount', 0),

  isNarrow: function() {
    if (this.get('isContentCard')) {
      if (this.get('isSimilarContent')) {
        return this.get('media.isSmallDesktop');
      } else {
        return this.get('media.isTabletOrSmallDesktop');
      }
    }
  }.property('isSimilarContent', 'isContentCard', 'media.isSmallDesktop', 'media.isTabletOrSmallDesktop'),

  parentContentId: function() {
    if (this.get('talk.parentContentType') === 'event') {
      return this.get('talk.parentEventInstanceId');
    } else {
      return this.get('talk.parentContentId');
    }
  }.property('talk.parentContentId'),

  actions: {
    trackSimilarContentClick() {
      this.trackEvent('selectSimilarContent', {
        navControl: 'Talk',
        navControlGroup: 'Talk Card',
        sourceContentId: get(this, 'sourceContentId')
      });
    }
  }
});
