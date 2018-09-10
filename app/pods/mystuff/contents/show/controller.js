import Ember from 'ember';

const { computed, get, inject:{service} } = Ember;

export default Ember.Controller.extend({
  tracking: service(),

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
      this.transitionToRoute('mystuff.contents.index');
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, get(this, 'contentType'), 'mystuff');
    }
  }
});
