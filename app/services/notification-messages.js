import { set } from '@ember/object';
import { A } from '@ember/array';
import NotificationsService from 'ember-cli-notifications/services/notification-messages-service';

export default NotificationsService.extend({
  defaultClearDuration: 5000,
  defaultAutoClear: true,

  init() {
    set(this, 'content', A());
    this._super(...arguments);
  },

  notifyLoginSuccess() {
    this.success('You are now signed in.', {
      cssClasses: 'NotificationMessages-loginSuccess'
    });
  }
});
