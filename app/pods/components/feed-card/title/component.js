import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import $ from 'jquery';

export default Component.extend({
  classNames: 'FeedCard-Title',
  classNameBindings: [
    'showSoldTag:sold-tag-active',
    'isOnDetailView:on-detail',
    'isTruncated:is-truncated'],

  fastboot: service(),
  floatingActionButton: service(),

  model: null,
  sold: alias('model.sold'),
  postedTime: false,
  title: null,
  isLoggedIn: false,
  linkToDetailIsActive: true,
  isOnDetailView: false,
  isPreview: false,
  afterHide: null,

  onContentClick() {},
  onShareContent() {},

  didInsertElement() {
    this._super(...arguments);
    next(() => {
      this._checkIsTruncated();
    });
  },

  viewCount: readOnly('model.viewCount'),
  commentCount: readOnly('model.commentCount'),

  showSoldTag: computed('model.{isMarket,sold}', function() {
    return get(this, 'model.isMarket') && get(this, 'model.sold');
  }),

  _checkIsTruncated() {
    const titleBox = $(get(this, 'element')).find('.title-real')[0];
    const cloneBox = $(get(this, 'element')).find('.title-clone')[0];
    const isTruncated = $(cloneBox).height() > $(titleBox).height();

    set(this, 'isTruncated', isTruncated);
  }
});
