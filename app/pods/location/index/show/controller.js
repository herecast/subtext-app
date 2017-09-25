import Ember from 'ember';

const { computed, get, inject:{controller} } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    eventInstanceId: 'eventInstanceId'
  },

  parentController: controller('location.index'),

  eventInstanceId: null,

  componentName: computed('model.normalizedContentType', function() {
    const contentType = get(this, 'model.normalizedContentType') || 'event';
    return `${contentType}-detail`;
  }),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('location.index');
    },

    integratedDetailLoaded(contentId) {
      get(this, 'parentController').trackIntegratedDetailLoaded(contentId);
    },

    scrolledPastDetail(contentId) {
      get(this, 'parentController').trackScrollPastIntegratedDetail(contentId);
    }
  }
});
