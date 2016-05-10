import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  set,
  get,
  inject,
  computed
} = Ember;

export default Ember.Component.extend(TrackEvent, {
  api: inject.service(),
  toast: inject.service(),
  imageUrl: computed.oneWay('currentUser.userImageUrl'),

  actions: {
    savePhoto(image) {
      const toast = get(this, 'toast');
      const api = get(this, 'api');
      const data = new FormData();

      data.append('current_user[image]', image);
      data.append('current_user[user_id]', this.get('currentUser.userId'));

      const promise = api.updateCurrentUserAvatar(data);

      this.trackEvent('selectNavControl', {
        navControlGroup: 'Profile Feature Submit',
        navControl: 'Submit Photo Change'
      });

      promise.then((data) => {
        set(this, 'currentUser.userImageUrl', data['current_user']['user_image_url']);
        toast.success('Avatar saved successfully!');
      }).catch((error) => {
        const serverError = get(error, 'errors.image');
        let errorMessage = 'Error: Unable to save avatar.';

        if (serverError) {
          errorMessage += ' ' + serverError;
        }

        toast.error(errorMessage);
      });
    }
  }
});
