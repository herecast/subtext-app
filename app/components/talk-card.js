import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';

const { get, computed } = Ember;

export default Ember.Component.extend(TrackCard, {
  title: Ember.computed.oneWay('talk.title'),
  isContentCard: false,
  isSimilarContent: false,
  classNameBindings: ['hasComments:TalkCard--stacked'],

  attributeBindings:["data-test-talk-card"],
  'data-test-talk-card': Ember.computed.oneWay('talk.id'),

  hasComments: Ember.computed.gt('talk.commentCount', 0),

  isNarrow: computed('isSimilarContent', 'isContentCard', 'media.isSmallDesktop', 'media.isTabletOrSmallDesktop', function() {
    if (this.get('isContentCard')) {
      if (this.get('isSimilarContent')) {
        return this.get('media.isSmallDesktop');
      } else {
        return this.get('media.isTabletOrSmallDesktop');
      }
    }
  }),

  parentContentId: computed('talk.parentContentId', function() {
    if (this.get('talk.parentContentType') === 'event') {
      return this.get('talk.parentEventInstanceId');
    } else {
      return this.get('talk.parentContentId');
    }
  }),

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
