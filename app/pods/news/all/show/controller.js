import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['scrollTo'],
  scrollTo: null,

  actions: {
    closeNewsDetailPage() {
      this.transitionToRoute('news.all');
    }
  }
});
