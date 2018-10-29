import Controller from '@ember/controller';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
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
