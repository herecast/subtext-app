import Ember from 'ember';

const { get, inject, computed } = Ember;

export default Ember.Controller.extend({
  parentController: inject.controller('feed'),
  history: inject.service(),

  isDirectLink: computed.reads('history.isFirstRoute'),

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
