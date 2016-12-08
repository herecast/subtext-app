import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Controller.extend({
  categoryController: inject.controller('market.category-landing'),

  actions: {
    closeMarketDetailPage() {
      const category = get(this, 'categoryController.cat');

      this.transitionToRoute('market.category-landing', category.id);
    }
  }
});
