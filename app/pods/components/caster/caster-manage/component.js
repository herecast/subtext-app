import { get, set, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'Caster-CasterManage',

  casterHideService: service('caster-hide'),

  caster: null,

  showFollowOptions: false,
  showHideOptions: false,

  wantsToUnhide: false,

  casterId: readOnly('caster.casterId'),
  casterName: readOnly('caster.name'),
  casterHandle: readOnly('caster.handle'),
  casterAvatarImageUrl: readOnly('caster.avatarImageUrl'),

  casterPageLinkId: computed('casterHandle', function() {
    return `@${get(this, 'casterHandle')}`;
  }),

  actions: {
    clickedUnhideButton() {
      set(this, 'wantsToUnhide', true);
    },

    unhide() {
      const casterId = get(this, 'casterId');

      get(this, 'casterHideService').unhide(casterId);
    },

    cancelUnhide() {
      set(this, 'wantsToUnhide', false);
    }
  }
});
