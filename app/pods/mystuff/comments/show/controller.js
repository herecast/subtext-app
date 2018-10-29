import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  tracking: service(),

  contentType: computed('model.contentType', function() {
    return get(this, 'model.contentType') || 'event';
  }),

  componentName: computed('contentType', function() {
    return `${ get(this, 'contentType')}-detail`;
  }),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('mystuff.comments.index');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, get(this, 'contentType'), 'mystuff');
    }
  }
});
