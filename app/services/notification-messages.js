import NotificationsService from 'ember-cli-notifications/services/notification-messages-service';

export default NotificationsService.extend({
  defaultClearDuration: 5000,
  defaultAutoClear: true,

  notifyLoginSuccess() {
    this.success('You are now signed in.', {
      cssClasses: 'NotificationMessages-loginSuccess'
    });
  }
});
