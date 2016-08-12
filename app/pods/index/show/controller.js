import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['ctype'],
  ctype: null,

  actions: {
    closeDetailPage() {
      this.transitionToRoute('index');
    }
  }
});
