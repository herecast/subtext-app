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

  linkId: function() {
    const parentContentId = this.get('talk.parentContentId');

    if (Ember.isPresent(parentContentId)) {
      return parentContentId;
    } else {
      return this.get('talk.id');
    }
  }.property('talk.{id,parentContentId}'),

  anchor: function() {
    return `comment-${this.get('talk.id')}`;
  }.property('talk.id'),

  numberText: function() {
    const count = this.get('talk.commenterCount');

    if (count === 1) {
      return 'person';
    } else {
      return 'people';
    }
  }.property('talk.commenterCount'),

  viewText: function() {
    const count = this.get('talk.viewCount');

    if (count === 1) {
      return 'view';
    } else {
      return 'views';
    }
  }.property('talk.viewCount')
});
