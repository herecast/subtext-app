import NotificationArrayProxy from 'ember-cli-notifications/services/notification-messages-service';
// import Ember from 'ember';

export default NotificationArrayProxy.extend({
  defaultClearDuration: 5000,
  defaultAutoClear: true
});
