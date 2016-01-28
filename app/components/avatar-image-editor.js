import Ember from 'ember';
import config from './../config/environment';
import ajax from 'ic-ajax';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  set,
  Binding
} = Ember;

export default Ember.Component.extend(TrackEvent, {
  isEditingImage: false,
  imageUrl: Binding.oneWay('currentUser.userimageUrl'),

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
            'currentUser.originalImageFile': undefined,
            'currentUser.userImageUrl': data['current_user']['user_image_url']
          });
        });
      }
    }
  }
});
