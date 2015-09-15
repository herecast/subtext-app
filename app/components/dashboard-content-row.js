import Ember from 'ember';

export default Ember.Component.extend({
  tagName: ['tr'],
  type: '',

  isTalk: Ember.computed.equal('type', 'talk'),

  contentType: function() {
    const type = this.get('type');

    if (type === 'market-post') {
      return 'Market';
    } else if (type === 'event-instance') {
      return 'Event';
    } else {
      return type.capitalize();
    }
  }.property(),

  publishedAt: function() {
    const type = this.get('type');
    let date;

    if (type === 'event-instance') {
      date = this.get('content.startsAt');
    } else {
      date = this.get('content.publishedAt');
    }

    if (date) {
      return date.format('l');
    }
  }.property(),

  isEditable: function() {
    const type = this.get('type');

    return type === 'market-post' || type === 'event-instance';
  }.property(),

  parentRoute: function() {
    const type = this.get('type');

    if (type === 'market-post') {
      return 'market';
    } else if (type === 'event-instance') {
      return 'events';
    } else {
      return type;
    }
  }.property(),

  parentContentId: function() {
    if (this.get('content.parentContentType') === 'event') {
      return this.get('content.parentEventInstanceId');
    } else {
      return this.get('content.parentContentId');
    }
  }.property('talk.parentContentId'),

  viewRoute: function() {
    return `${this.get('parentRoute')}.show`;
  }.property(),

  editRoute: function() {
    return `${this.get('parentRoute')}.edit`;
  }.property()
});
