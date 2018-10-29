import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
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

  viewCount: readOnly('model.viewCount'),
  commentCount: readOnly('model.commentCount'),

  actions: {
    toggleSold() {
      this.toggleProperty('sold');
      get(this, 'model').save();
    }
  }
});
