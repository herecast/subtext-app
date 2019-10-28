import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { oneWay, readOnly, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  fastboot: service(),
  modals: service(),
  session: service(),
  casterFollowService: service('caster-follow'),

  caster: null,
  casterId: oneWay('caster.id'),
  updateCaster: true,

  wantsToUnfollow: false,

  casterFollows: readOnly('casterFollowService.casterFollows'),

  followOnThisCaster: computed('casterFollows.[]', 'casterId', function() {
    const casterFollows = get(this, 'casterFollows') || [];
    const casterId = get(this, 'casterId') || null;

    if (casterFollows.length && isPresent(casterId)) {
      const followOnThisCaster = casterFollows.find((casterFollow) => {
        return parseInt(casterId) === parseInt(get(casterFollow, 'casterId'));
      });

      return followOnThisCaster || null;
    }

    return null;
  }),

  isFollowing: notEmpty('followOnThisCaster'),
  isLoading: computed('casterFollowService.isLoadingCasterId', 'casterId', function() {
    const isLoadingCasterId = get(this, 'casterFollowService.isLoadingCasterId');
    const casterId = get(this, 'casterId');

    return parseInt(isLoadingCasterId) === parseInt(casterId);
  }),

  actions: {
    follow() {
      if (get(this, 'caster.isCurrentUser')) {
        get(this, 'modals').showModal('modals/simple-message', {
          message: "You can't follow yourself, unfortunately :)"
        });
      }
      else if (get(this, 'session.isAuthenticated')) {
        //does update caster flow properly here from caster/caster-manage?
        get(this, 'casterFollowService').follow(get(this, 'casterId'), get(this, 'updateCaster'));
      } else {
        get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
      }
    },

    startUnfollow() {
      set(this, 'wantsToUnfollow', true);
    },

    cancelUnfollow() {
      set(this, 'wantsToUnfollow', false);
    },

    unfollow() {
      set(this, 'wantsToUnfollow', false);
      get(this, 'casterFollowService').unfollow(get(this, 'casterId'), get(this, 'updateCaster'));
    }
  }
});
