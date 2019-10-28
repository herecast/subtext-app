import { get, set, computed } from '@ember/object';
import { readOnly, notEmpty } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'HideCasterButton',

  casterHideService: service('caster-hide'),
  casterHides: readOnly('casterHideService.casterHides'),
  fastboot: service(),
  modals: service(),

  caster: null,
  contentId: null,
  afterHide: null,

  wantsToHideCaster: false,
  additionToMessage: null,

  casterId: readOnly('caster.id'),

  _openSignInModal() {
    get(this, 'modals').showModal('modals/sign-in-register', {
      model: 'sign-in',
      alternateSignInMessage: 'You must be signed in to manage your feed preferences.'
    });
  },

  hideOnThisCaster: computed('casterHides.[]', 'casterId', function() {
    const casterHides = get(this, 'casterHides') || [];
    const casterId = get(this, 'casterId') || null;

    if (casterHides.length && isPresent(casterId)) {
      const hideOnThisCaster = casterHides.find((casterHide) => {
        return parseInt(casterId) === parseInt(get(casterHide, 'casterId'));
      });

      return hideOnThisCaster || null;
    }

    return null;
  }),

  hasHiddenThisCaster: notEmpty('hideOnThisCaster'),

  actions: {
    clickedHideButton() {
      if (get(this, 'session.isAuthenticated')) {
        set(this, 'wantsToHideCaster', true);
      } else {
        this._openSignInModal();
      }
    },

    afterHide() {
      if (get(this, 'afterHide')) {
        get(this, 'afterHide')();
      }

      set(this, 'wantsToHideCaster', false);
    },

    afterCancel() {
      set(this, 'wantsToHideCaster', false);
    }
  }
});
