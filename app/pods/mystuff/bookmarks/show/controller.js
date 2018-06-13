import Ember from 'ember';

const { computed, get, inject:{service} } = Ember;

export default Ember.Controller.extend({
  tracking: service(),

  contentType: computed('model.contentType', function() {
    return get(this, 'model.contentType') || 'event';
  }),

  componentName: computed('contentType', function() {
    return `${ get(this, 'contentType')}-detail`;
  }),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('mystuff.bookmarks.index');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, get(this, 'contentType'), 'mystuff');
    }
  }
});
