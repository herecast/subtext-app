import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { get } from '@ember/object';

export default Controller.extend({
  parentController: controller('feed'),
  history: service(),

  isDirectLink: reads('history.isFirstRoute'),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('feed');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, 'event', 'feed');
    }
  }
});
