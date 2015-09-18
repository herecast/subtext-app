import Ember from 'ember';

export default Ember.Component.extend({
  title: Ember.computed.oneWay('talk.title'),
  isContentCard: false,
  isSimilarContent: false,

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
  }.property('talk.parentContentId')
});
