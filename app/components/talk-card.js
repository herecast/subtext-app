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

  numberText: function() {
    const count = this.get('talk.commenterCount');

    if (count === 1) {
      return 'post';
    } else {
      return 'posts';
    }
  }.property('talk.commenterCount'),

  parentContentId: function() {
    if (this.get('talk.parentContentType') === 'event') {
      return this.get('talk.parentEventInstanceId');
    } else {
      return this.get('talk.parentContentId');
    }
  }.property('talk.parentContentId'),

  viewText: function() {
    const count = this.get('talk.viewCount');

    if (count === 1) {
      return 'view';
    } else {
      return 'views';
    }
  }.property('talk.viewCount')
});
