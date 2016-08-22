import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['ctype', 'scrollTo'],
  scrollTo: null,
  ctype: 'talk',

  displayPromotion: true,

  actions: {
    closeTalkDetailPage() {
      this.transitionToRoute('talk.all');
    }
  }
});
