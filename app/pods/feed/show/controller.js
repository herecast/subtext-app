import Ember from 'ember';

const { computed, get, inject } = Ember;

export default Ember.Controller.extend({
  parentController: inject.controller('feed'),
  history: inject.service(),

  isDirectLink: computed.reads('history.isFirstRoute'),

  componentName: computed('model.normalizedContentType', function() {
    const contentType = get(this, 'model.normalizedContentType') || 'event';
    return `${contentType}-detail`;
  }),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('feed');
    },

    integratedDetailLoaded(contentId) {
      get(this, 'parentController').trackIntegratedDetailLoaded(contentId);
    },

    scrolledPastDetail(contentId) {
      get(this, 'parentController').trackScrollPastIntegratedDetail(contentId);
    }
  }
});
