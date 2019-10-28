import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import Service from '@ember/service';

export default Service.extend({
  api: service(),
  fastboot: service(),
  notify: service('notification-messages'),
  session: service(),
  store: service(),

  casterFollows: null,
  isLoadingCasterId: null,

  currentUser: computed(function() {
    return Promise.resolve( get(this, 'session.currentUser') );
  }),

  init() {
    this._super(...arguments);

    get(this, 'session').on('authenticationSucceeded', this, '_getFollows');

    this._getFollows();
  },

  _getFollows() {
    if (get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      get(this, 'currentUser').then(() => {
        const casterFollows = get(this, 'store').peekAll('caster-follow');

        set(this, 'casterFollows', casterFollows);
      });
    }
  },

  _getFollow(casterId) {
    const casterFollows = get(this, 'casterFollows') || [];

    const matchingFollow = casterFollows.find((casterFollow) => {
      if (isPresent(casterFollow)) {
        return parseInt(casterId) === parseInt(get(casterFollow, 'casterId'));
      }
      return false;
    });

    return matchingFollow || null;
  },

  _addToCasterFollowCount(casterId, addTo=0) {
    this._getCaster(casterId)
    .then((caster) => {
      const activeFollowersCount = get(caster, 'activeFollowersCount');
      set(caster, 'activeFollowersCount', activeFollowersCount + addTo);
    });
  },

  _getCaster(casterId) {
    return new Promise((resolve) => {
      let caster = get(this, 'store').peekRecord('caster', casterId);

      if (isPresent(get(caster, 'id'))) {
        resolve(caster);
      } else {
        return get(this, 'store').findRecord('caster', casterId);
      }
    });
  },

  _createFollow(caster, updateCaster) {
    const casterId = get(caster, 'id');
    const newFollow = get(this, 'store').createRecord('caster-follow', {
      casterId: casterId,
      casterAvatarImageUrl: caster.avatarImageUrl,
      casterHandle: caster.handle,
      casterName: caster.name
    });

    return newFollow.save()
    .then(() => {
      this._getFollows();
      get(this, 'notify').success(`You've followed! You will now receive an email alert when they post.`);
      if (updateCaster) {
        this._addToCasterFollowCount(casterId, 1);
      }
    })
    .catch(() => {
      newFollow.destroyRecord();
      get(this, 'notify').error('There was a problem following. Please reload page and try again.');
    })
    .finally(() => {
      set(this, 'isLoadingCasterId', null);
    });
  },

  follow(casterId, updateCaster = true) {
    if (get(this, 'session.isAuthenticated')) {
      set(this, 'isLoadingCasterId', casterId);

      const casterFromStore = get(this, 'store').peekRecord('caster', casterId);

      if (isPresent(casterFromStore)) {
        this._createFollow(casterFromStore, updateCaster);
      } else {
        //if caster not there, can check if all properties available possibly
        get(this, 'store').findRecord('caster', casterId)
        .then(caster => {
          this._createFollow(caster, updateCaster);
        });
      }

    }
  },

  unfollow(casterId, updateCaster = true) {
    set(this, 'isLoadingCasterId', casterId);

    const follow = this._getFollow(casterId);

    if (isPresent(follow)) {
      return follow.destroyRecord()
      .then(() => {
        get(this, 'notify').success(`You are no longer following and will not receive notifications from this caster.`);
        if (updateCaster) {
          this._addToCasterFollowCount(casterId, -1);
        }
      })
      .catch(() => {
        get(this, 'notify').error('There was a problem unfollowing. Please reload page and try again.');
      })
      .finally(() => {
        set(this, 'isLoadingCasterId', null);
      });
    }
  }
});
