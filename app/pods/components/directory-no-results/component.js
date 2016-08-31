import Ember from 'ember';

export default Ember.Component.extend({
  // Should be initialized when component is rendered
  category: null,
  searchTerms: null,
  location: null,
  showBusinessProfileForm: false,

  actions: {
    toggleBusinessProfileForm() {
      this.toggleProperty('showBusinessProfileForm');
    }
  }
});
