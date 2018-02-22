import Ember from 'ember';

const { computed, get, inject } = Ember;

export default Ember.Controller.extend({
  parentController: inject.controller('feed'),
  history: inject.service(),
  tracking: inject.service(),

  isDirectLink: computed.reads('history.isFirstRoute'),

  contentType: computed('model.normalizedContentType', function() {
    return get(this, 'model.normalizedContentType') || 'event';
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
