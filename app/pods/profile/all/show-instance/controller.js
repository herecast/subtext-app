import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Controller.extend({
  tracking: service(),
  history: service(),

  isDirectLink: computed.reads('history.isFirstRoute'),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('profile.all');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, 'event', 'profile');
    }
  }
});
