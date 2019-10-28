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
  tracking: service(),

  casterHides: null,
  isLoadingCasterId: null,

  currentUser: computed(function() {
    return Promise.resolve( get(this, 'session.currentUser') );
  }),

  init() {
    this._super(...arguments);

    get(this, 'session').on('authenticationSucceeded', () => {
      this._getHides(true);
    });

    this._getHides();
  },

  _getHides(removeCasterContent = false) {
    if (get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      get(this, 'currentUser').then(() => {
        const casterHides = get(this, 'store').peekAll('caster-hide');

        set(this, 'casterHides', casterHides);

        if (removeCasterContent) {
          casterHides.forEach((casterHide) => {
            this.removeCasterContent(get(casterHide, 'casterId'));
          });
        }
      });
    }
  },

  _getHide(casterId) {
    const casterHides = get(this, 'casterHides') || [];

    const matchingHide = casterHides.find((casterHide) => {
      if (isPresent(casterHide)) {
        return parseInt(casterId) === parseInt(get(casterHide, 'casterId'));
      }
      return false;
    });

    return matchingHide || null;
  },

  _addHideToCurrentUser(casterHide) {
    if (get(this, 'session.isAuthenticated')) {
      get(this, 'currentUser').then(currentUser => {
        const casterHides = get(this, 'casterHides');
        casterHides.pushObject(casterHide);
        set(currentUser, 'casterHides', casterHides);
      });
    }
  },

  removeCasterContent(casterId) {
    return new Promise((resolve) => {
      const contents = get(this, 'store').peekAll('content');
      contents.forEach((content) => {
        let contentCasterId = get(content, 'casterId');
        if (parseInt(contentCasterId) === parseInt(casterId)) {
          set(content, 'isHiddenFromFeed', true);
        }
      });

      return resolve();
    });
  },

  hide(casterId, contentId, flagType) {
    if (get(this, 'session.isAuthenticated')) {
      set(this, 'isLoadingCasterId', casterId);

      const newHide = get(this, 'store').createRecord('caster-hide', {
        casterId,
        contentId,
        flagType
      });

      get(this, 'tracking').trackHideCaster(newHide);

      return newHide.save()
      .then(() => {
        this._getHides();
      })
      .catch(() => {
        get(this, 'notify').error('There was a problem hiding. Please reload page and try again.');
      })
      .finally(() => {
        set(this, 'isLoadingCasterId', null);
      });
    }
  },

  unhide(casterId) {
    set(this, 'isLoadingCasterId', casterId);

    const hide = this._getHide(casterId);

    get(this, 'tracking').trackUnhideCaster(hide);

    if (isPresent(hide)) {
      return hide.destroyRecord()
      .catch(() => {
        get(this, 'notify').error('There was a problem unhiding. Please reload page and try again.');
      })
      .finally(() => {
        set(this, 'isLoadingCasterId', null);
      });
    }
  }
});
