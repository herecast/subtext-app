import Ember from 'ember';

const { get, computed, inject } = Ember;

export default Ember.Controller.extend({
  notify: inject.service('notification-messages'),
  listservName: computed.alias('model.listserv.name'),
  confirmationKey: computed.alias('model.id'),

  existingUser: computed.notEmpty('model.userId'),

  redirectToIndex() {
    window.scrollTo(0,0);
    this.transitionToRoute('index');
  },

  notifySuccess() {
    const notify = get(this, 'notify');
    notify.info(`
      <div>
        <h4>Thanks for registering on dailyUV!</h4>
        This is the main landing page, showing the latest content.
        Click on News, Events, Market, Talk or Directory to see more!
      </div>`,
      {htmlContent: true}
    );
  },

  actions: {
    registrationSuccess() {
      this.notifySuccess();
      this.redirectToIndex();
    }
  }
});
