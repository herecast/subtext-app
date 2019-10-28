import { get } from '@ember/object';
import { readOnly, equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-TabBar'],

  caster: null,
  activeTab: null,

  changeTab: function() {},

  postsIsActive: equal('activeTab', 'posts'),
  commentsIsActive: equal('activeTab', 'comments'),
  aboutIsActive: equal('activeTab', 'about'),

  likedIsActive: equal('activeTab', 'liked'),
  followingIsActive: equal('activeTab', 'following'),
  hidingIsActive: equal('activeTab', 'hiding'),

  casterIsCurrentUser: readOnly('caster.isCurrentUser'),

  postCount: readOnly('caster.totalPostCount'),
  commentCount: readOnly('caster.totalCommentCount'),

  actions: {
    changeTab(tab) {
      get(this, 'changeTab')(tab);
    }
  }
});
