import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Attribution',

  avatarUrl: null,
  author: null,
  postedTime: null,
  linkRouteName: null,
  linkId: null,
  contentId: null,
  noPadding: false,
  customSize: 40,

  hasLinkRouteName: computed.notEmpty('linkRouteName'),

  authorNameFormatted: computed('author', function() {
    const author = get(this, 'author') || '';

    if (author.indexOf('@') >= 0) {
      return author.split('@')[0];
    }

    return author;
  })
});
