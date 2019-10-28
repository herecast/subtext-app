import { get, set, computed, setProperties } from '@ember/object';
import { readOnly, notEmpty } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'HideCasterButton',

  casterHideService: service('caster-hide'),
  casterHides: readOnly('casterHideService.casterHides'),
  router: service(),

  caster: null,
  casterId: readOnly('caster.id'),
  casterName: readOnly('caster.attributionName'),
  casterAvatarImageUrl: readOnly('caster.avatarImageUrl'),
  contentId: null,

  showSuccess: false,
  flagType: null,
  hasFlagType: notEmpty('flagType'),
  isInvalid: false,
  wantsToHideCaster: false,
  hasHiddenCaster: false,
  afterHide: null,
  afterCancel: null,
  additionToMessage: null,

  init() {
    this._super(...arguments);
    
    setProperties(this, {
      flagTypes: ['Not relevant to me', 'Not relevant to my location', 'Offensive to me', 'I see too much by this caster']
    });
  },

  _resetProperties() {
    setProperties(this, {
      isInvalid: false,
      flagType: null,
      wantsToHideCaster: false
    });
  },

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
    close() {
      this._resetProperties();

      if (get(this, 'hasHiddenCaster')) {
        const casterId = get(this, 'casterId');

        get(this, 'casterHideService').removeCasterContent(casterId)
        .then(() => {
          if (get(this, 'afterHide')) {
            get(this, 'afterHide')();
          } else {
            get(this, 'router').transitionTo('feed');
          }
        });
      } else {
        if (get(this, 'afterCancel')) {
          get(this, 'afterCancel')();
        }
      }
    },

    hide() {
      const casterId = get(this, 'caster.id');
      const contentId = get(this, 'contentId');
      const flagType = get(this, 'flagType');

      if (isPresent(flagType)) {
        get(this, 'casterHideService').hide(casterId, contentId, flagType)
        .then(() => {
          setProperties(this, {
            'showSuccess': true,
            'hasHiddenCaster': true
          });
        });
      } else {
        set(this, 'isInvalid', true);
      }
    }
  }
});
