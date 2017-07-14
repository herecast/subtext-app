import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    contentType: 'ctype'
  },
  contentType: 'news',

  actions: {
    closeDetailPage() {
      this.transitionToRoute('biz.show');
    }
  }
});
