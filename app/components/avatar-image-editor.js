import Ember from 'ember';

const {
  set,
  get,
  inject,
  computed
} = Ember;

export default Ember.Component.extend({
  api: inject.service(),
  notify: inject.service('notification-messages'),
  imageUrl: computed.oneWay('currentUser.userImageUrl'),

  actions: {
    savePhoto(image) {
      const notify = get(this, 'notify');
      const api = get(this, 'api');
      const data = new FormData();

      data.append('current_user[image]', image);
      data.append('current_user[user_id]', this.get('currentUser.userId'));

      const promise = api.updateCurrentUserAvatar(data);

      promise.then((data) => {
        set(this, 'currentUser.userImageUrl', data['current_user']['user_image_url']);
        notify.success('Avatar saved successfully!');
      }).catch((error) => {
        const serverError = get(error, 'errors.image');
        let errorMessage = 'Error: Unable to save avatar.';

        if (serverError) {
          errorMessage += ' ' + serverError;
        }

        notify.error(errorMessage);
      });
    }
  }
});
