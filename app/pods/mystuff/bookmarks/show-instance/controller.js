import Ember from 'ember';

const { get, inject:{service} } = Ember;

export default Ember.Controller.extend({
  tracking: service(),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('mystuff.bookmarks.index');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, 'event', 'mystuff');
    }
  }
});
