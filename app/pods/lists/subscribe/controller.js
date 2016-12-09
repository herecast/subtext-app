import Ember from 'ember';

const { get, computed, inject } = Ember;

export default Ember.Controller.extend({
  notify: inject.service('notification-messages'),
  listservName: computed.alias('model.listserv.name'),

  confirmationKey: computed('model.id', function() {
    const modelId = get(this, 'model.id');
    return `subscription/${modelId}`;
  }),

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
      {
        htmlContent: true,
        clearDuration: 15000
      }
    );
  },

  actions: {
    registrationSuccess() {
      this.notifySuccess();
      this.redirectToIndex();
    }
  }
});
