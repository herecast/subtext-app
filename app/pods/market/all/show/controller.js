import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    closeMarketDetailPage() {
      this.transitionToRoute('market.all');
    }
  }
});
