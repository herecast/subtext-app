import Ember from 'ember';
import DS from 'ember-data';

const { get, computed, isPresent, setProperties, inject } = Ember;

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  email: DS.attr('string'),
  userImageUrl: DS.attr('string'),
  listservId: DS.attr('number'),
  listservName: DS.attr('string'),
  location: DS.attr('string'),
  locationId: DS.attr('string'),
  name: DS.attr('string'),
  testGroup: DS.attr('string'),
  userId: DS.attr('number'),
  managedOrganizations: DS.hasMany('organization', {async: true}),
  canPublishNews: DS.attr('boolean'),

  // Used to store pending changes which are submitted via the api service
  password: null,
  passwordConfirmation: null,
  avatarImage: null,

  api: inject.service(),

  hasPendingChanges: computed('hasDirtyAttributes', 'password', 'passwordConfirmation', 'avatarImage', function() {
    return get(this, 'hasDirtyAttributes') ||
      isPresent(get(this, 'password')) ||
      isPresent(get(this, 'passwordConfirmation')) ||
      isPresent(get(this, 'avatarImage'));
  }),

  rollbackAttributes() {
    setProperties(this, {
      password: null,
      passwordConfirmation: null,
      avatarImage: null
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

      return rsvpHash;
    });
  },

  saveAvatar() {
    const api = get(this, 'api');
    const data = new FormData();

    data.append('current_user[image]', get(this, 'avatarImage'));
    data.append('current_user[user_id]', get(this, 'userId'));

    const promise = api.updateCurrentUserAvatar(data);

    promise.then(({current_user}) => {
      setProperties(this, {
        userImageUrl: current_user.user_image_url,
        avatarImage: null
      });
      return this.reload();
    });

    return promise;
  },

  savePassword() {
    const api = get(this, 'api');

    const promise = api.updateCurrentUserPassword({
      current_user: {
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
  }
});
