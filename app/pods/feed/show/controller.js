import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { get, computed } from '@ember/object';

export default Controller.extend({
  parentController: controller('feed'),
  history: service(),
  tracking: service(),

  isDirectLink: reads('history.isFirstRoute'),

  contentType: computed('model.contentType', function() {
    const modelContentType = get(this, 'model.contentType');
    let contentType = modelContentType;

    if (modelContentType === 'talk') {
      contentType = 'market';
    }

    return contentType || 'event';
  }),

  componentName: computed('contentType', function() {
    return `${ get(this, 'contentType')}-detail`;
  }),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('feed');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, get(this, 'contentType'), 'feed');
    }
  }
});
