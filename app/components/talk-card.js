import Ember from 'ember';

export default Ember.Component.extend({
  title: Ember.computed.oneWay('talk.title'),
  isContentCard: false,
  isSimilarContent: false,
  mixpanel: Ember.inject.service('mixpanel'),

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
      const sourceContentId = window.location.href.split('/').slice(-1).pop();

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, 
         mixpanel.getNavigationProperties('Talk', 'Talk Card', 1));
      Ember.merge(props, mixpanel.getContentProperties(this.get('talk')));
      Ember.merge(props, {'sourceContentId': sourceContentId});
      mixpanel.trackEvent('selectSimilarContent', props);
    }
  }
});
