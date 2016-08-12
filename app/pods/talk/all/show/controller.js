import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['scrollTo', 'ctype'],
  ctype: 'talk',

  displayPromotion: true,

  actions: {
    closeTalkDetailPage() {
      this.transitionToRoute('talk.all');
    }
  }
});
