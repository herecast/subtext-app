import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    scrollToAnchor: 'scrollTo'
  },
  scrollToAnchor: null,

  actions: {
    closeNewsDetailPage() {
      this.transitionToRoute('organization-profile');
    }
  }
});