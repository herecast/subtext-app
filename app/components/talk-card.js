import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';

export default Ember.Component.extend(TrackCard, {
  title: Ember.computed.oneWay('talk.title'),
  isContentCard: false,
  isSimilarContent: false,
  mixpanel: Ember.inject.service('mixpanel'),
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
    trackSimilarContentClick(){
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, 
         mixpanel.getNavigationProperties('Talk', 'Talk Card', 1));
      Ember.merge(props, mixpanel.getContentProperties(this.get('talk')));
      Ember.merge(props, {'sourceContentId': this.get('sourceContentId')});
      mixpanel.trackEvent('selectSimilarContent', props);
    }
  }
});
