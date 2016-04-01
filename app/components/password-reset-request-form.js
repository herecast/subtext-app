import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  tagName: 'form',
  showConfirmation: false,

  actions: {
    submit() {
      const url = `${config.API_NAMESPACE}/password_resets`;

      ajax(url, {
        type: 'POST',
        data: {
          user: {
            email: this.get('email')
          }
        }
      }).then(() => {
        this.set('showConfirmation', true);
      });
    }
  }
});