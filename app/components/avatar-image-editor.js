import Ember from 'ember';
import { InvalidError } from 'ember-ajax/errors';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  set,
  get,
  inject,
  computed
} = Ember;

export default Ember.Component.extend(TrackEvent, {
  api: inject.service('api'),
  isEditingImage: false,
  imageUrl: computed.oneWay('currentUser.userimageUrl'),
  originalImageFile: computed.alias('currentUser.originalImageFile'),
  errorMessage: null,

  actions: {
    changePhoto() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Profile Feature Edit',
        navControl: 'photo'
      });

      set(this, 'isEditingImage', true);
      this.$('.ContentForm-fileField').click();
    },

    savePhoto(callback) {
      const api = get(this, 'api');
      const data = new FormData();

      if (this.get('currentUser.image')) {
        data.append('current_user[image]', this.get('currentUser.image'));
        data.append('current_user[user_id]', this.get('currentUser.userId'));

        const promise = api.updateCurrentUserAvatar(data);

        callback(promise);

        this.trackEvent('selectNavControl', {
          navControlGroup: 'Profile Feature Submit',
          navControl: 'Submit Photo Change'
        });

        promise.then((data) => {
          this.setProperties({
            isEditingImage: false,
            errorMessage: null,
            originalImageFile: undefined,
            'currentUser.userImageUrl': data['current_user']['user_image_url']
          });
        }).catch((response) => {
          if (response instanceof InvalidError) {
            const serverError = response.errors[0];

            set(this, 'errorMessage', serverError.detail.messages[0]);
          }
        });
      }
    },

    cancel() {
      this.setProperties({
        isEditingImage: false,
        errorMessage: null,
        originalImageFile: undefined
      });
    }
  }
});
