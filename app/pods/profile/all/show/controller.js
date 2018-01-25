import Ember from 'ember';

const {computed, get, inject:{service} } = Ember;

export default Ember.Controller.extend({
  history: service(),

  isDirectLink: computed.reads('history.isFirstRoute'),

  componentName: computed('model.normalizedContentType', function() {
    const contentType = get(this, 'model.normalizedContentType') || 'event';
    return `${contentType}-detail`;
  }),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('profile.all');
    }
  }
});
