import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Title',
  classNameBindings: ['sold:sold-tag-active', 'showToggleSold:sold-tag-active', 'condensedView:condensed-view'],

  model: null,
  postedTime: false,
  title: null,
  sold: false,
  showToggleSold: false,
  condensedView: false,
  isLoggedIn: false,
  linkToDetailIsActive: true,
  onContentClick() {},

  viewCount: computed.readOnly('model.viewCount'),
  commentCount: computed.readOnly('model.commentCount'),

  actions: {
    toggleSold() {
      this.toggleProperty('sold');
      get(this, 'model').save();
    }
  }
});
