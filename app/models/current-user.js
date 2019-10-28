import { inject as service } from '@ember/service';
import { get, setProperties, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import DS from 'ember-data';
import Caster from './caster';

const { attr } = DS;

export default Caster.extend({
  //CURRENT_USER ONLY ATTRIBUTES
  publisherAgreementConfirmed: attr('boolean'),

  //INTERNAL METHODS AND PROPERTIES FOR UPDATE MODEL
  password: null,
  passwordConfirmation: null,
  avatarImage: null,
  backgroundImage: null,

  api: service(),

  hasPendingChanges: computed('hasDirtyAttributes', 'password', 'passwordConfirmation', 'avatarImage', 'backgroundImage', function() {
    return get(this, 'hasDirtyAttributes') ||
      isPresent(get(this, 'password')) ||
      isPresent(get(this, 'passwordConfirmation')) ||
      isPresent(get(this, 'avatarImage')) ||
      isPresent(get(this, 'backgroundImage'));
  }),

  rollbackAttributes() {
    setProperties(this, {
      password: null,
      passwordConfirmation: null,
      avatarImage: null,
      backgroundImage: null
    });

    return this._super(...arguments);
  },

  save() {
    return this._super(...arguments).then(() => {
      const rsvpHash = {};

      if (isPresent(get(this, 'password'))) {
        rsvpHash.password = this.savePassword();
      }

      if (isPresent(get(this, 'avatarImage'))) {
        rsvpHash.avatarImage = this.saveAvatar();
      }

      if (isPresent(get(this, 'backgroundImage'))) {
        rsvpHash.avatarImage = this.saveBackground();
      }

      return rsvpHash;
    });
  },

  saveAvatar() {
    const api = get(this, 'api');
    const data = new FormData();

    data.append('current_user[avatar]', get(this, 'avatarImage'));

    const promise = api.updateCurrentUserImage(data);

    promise.then(({current_user}) => {
      setProperties(this, {
        avatarImageUrl: current_user.avatar_image_url,
        avatarImage: null
      });
      return this.reload();
    });

    return promise;
  },

  saveBackground() {
    const api = get(this, 'api');
    const data = new FormData();

    data.append('current_user[background_image]', get(this, 'backgroundImage'));

    const promise = api.updateCurrentUserImage(data);

    promise.then(({current_user}) => {
      setProperties(this, {
        backgroundImageUrl: current_user.background_image_url,
        backgroundImage: null
      });
      return this.reload();
    });

    return promise;
  },

  savePassword() {
    const api = get(this, 'api');

    const promise = api.updateCurrentUserPassword({
      caster: {
        user_id: get(this, 'userId'),
        password: get(this, 'password'),
        password_confirmation: get(this, 'passwordConfirmation')
      }
    });

    promise.then(() => {
      setProperties(this, {
        password: null,
        passwordConfirmation: null
      });
    });

    return promise;
  },

  canEditContent(contentCasterId) {
    const userId = get(this, 'userId') || null;

    if (parseInt(contentCasterId) === parseInt(userId)) {
      return true;
    }

    return false;
  }
});
