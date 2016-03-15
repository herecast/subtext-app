import Ember from 'ember';
import config from './../config/environment';
import ajax from 'ic-ajax';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  set,
  computed
} = Ember;

export default Ember.Component.extend(TrackEvent, {
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
      const url = `${config.API_NAMESPACE}/current_user`;
      const data = new FormData();

      if (this.get('currentUser.image')) {
        data.append('current_user[image]', this.get('currentUser.image'));
        data.append('current_user[user_id]', this.get('currentUser.userId'));

        const promise = ajax(url, {
          data: data,
          type: 'PUT',
          contentType: false,
          processData: false
        });

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
          if (response.jqXHR.status === 422) {
            const responseJSON = response.jqXHR.responseJSON;

            set(this, 'errorMessage', responseJSON['messages'][0]);
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
