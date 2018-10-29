import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  tracking: service(),
  history: service(),

  isDirectLink: reads('history.isFirstRoute'),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('profile.all');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, 'event', 'profile');
    }
  }
});
