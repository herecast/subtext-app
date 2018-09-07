import Ember from 'ember';

const { computed, get, inject } = Ember;

export default Ember.Controller.extend({
  parentController: inject.controller('feed'),
  history: inject.service(),
  tracking: inject.service(),

  isDirectLink: computed.reads('history.isFirstRoute'),

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
