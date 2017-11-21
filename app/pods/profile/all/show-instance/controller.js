import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    closeDetailPage() {
      this.transitionToRoute('profile.all');
    }
  }
});
