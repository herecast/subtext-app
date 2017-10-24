import Ember from 'ember';

const {computed, get} = Ember;

export default Ember.Controller.extend({

  componentName: computed('model.normalizedContentType', function() {
    const contentType = get(this, 'model.normalizedContentType') || 'event';
    return `${contentType}-detail`;
  }),

  actions: {
    closeDetailPage() {
      this.transitionToRoute('profile');
    }
  }
});
