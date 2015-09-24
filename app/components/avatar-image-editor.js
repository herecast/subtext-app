import Ember from 'ember';
import config from './../config/environment';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  isEditingImage: false,

  actions: {
    changePhoto() {
      this.toggleProperty('isEditingImage');
      this.$('.ContentForm-fileField').click();
    },

    savePhoto() {
      this.toggleProperty('isEditingImage');
      const url = `${config.API_NAMESPACE}/current_user`;
      const data = new FormData();

      if (this.get('currentUser.image')) {
        data.append('current_user[image]', this.get('currentUser.image'));
        data.append('current_user[user_id]', this.get('currentUser.userId'));

        return ajax(url, {
          data: data,
          type: 'PUT',
          contentType: false,
          processData: false
        });
      }
    }
  }
});
