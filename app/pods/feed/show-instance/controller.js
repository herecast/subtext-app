import Ember from 'ember';

const { get, inject, computed } = Ember;

export default Ember.Controller.extend({
  parentController: inject.controller('feed'),
  history: inject.service(),

  isDirectLink: computed.reads('history.isFirstRoute'),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('feed');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, 'event', 'feed');
    }
  }
});
