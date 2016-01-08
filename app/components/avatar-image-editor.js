import Ember from 'ember';
import config from './../config/environment';
import ajax from 'ic-ajax';

const {
  set
} = Ember;

export default Ember.Component.extend({
  isEditingImage: false,

  actions: {
    changePhoto() {
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

        promise.then(() => {
          this.setProperties({
            isEditingImage: false,
            'currentUser.originalImageFile': undefined
          });
        });
      }
    }
  }
});
