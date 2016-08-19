import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    scrollToAnchor: 'scrollTo',
    ctype: 'ctype'
  },
  scrollToAnchor: null,
  ctype: 'talk',

  displayPromotion: true,

  actions: {
    closeTalkDetailPage() {
      this.transitionToRoute('talk.all');
    }
  }
});
