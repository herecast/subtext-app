import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import $ from 'jquery';

export default Component.extend({
  classNames: 'FeedCard-Title',
  classNameBindings: [
    'sold:sold-tag-active',
    'showToggleSold:sold-tag-active',
    'condensedView:condensed-view',
    'isOnDetailView:on-detail',
    'isTruncated:is-truncated'],

  fastboot: service(),

  model: null,
  postedTime: false,
  title: null,
  sold: false,
  showToggleSold: false,
  condensedView: false,
  isLoggedIn: false,
  linkToDetailIsActive: true,
  isOnDetailView: false,
  hideBookmark: false,

  onContentClick() {},

  didInsertElement() {
    this._super(...arguments);
    next(() => {
      this._checkIsTruncated();
    });
  },

  viewCount: readOnly('model.viewCount'),
  commentCount: readOnly('model.commentCount'),

  _checkIsTruncated() {
    const titleBox = $(get(this, 'element')).find('.title-real')[0];
    const cloneBox = $(get(this, 'element')).find('.title-clone')[0];
    const isTruncated = $(cloneBox).height() > $(titleBox).height();

    set(this, 'isTruncated', isTruncated);
  },

  actions: {
    toggleSold() {
      this.toggleProperty('sold');
      get(this, 'model').save();
    }
  }
});
