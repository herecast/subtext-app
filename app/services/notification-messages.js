import Ember from 'ember';
import NotificationsService from 'ember-cli-notifications/services/notification-messages-service';

const {get, inject} = Ember;

export default NotificationsService.extend({
  defaultClearDuration: 5000,
  defaultAutoClear: true,
  routing: inject.service('-routing'),

  notifyLoginSuccess() {
    const router = get(this, 'routing.router');
    const url = router.generate('dashboard');

    this.success(`You are now signed in. Manage your content <a href="${url}">here</a>.`, {
      cssClasses: 'NotificationMessages-loginSuccess',
      htmlContent: true
    });
  }
});
