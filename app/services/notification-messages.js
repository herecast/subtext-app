import Ember from 'ember';
import NotificationsService from 'ember-cli-notifications/services/notification-messages-service';

const { set, A } = Ember;

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
