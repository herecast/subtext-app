import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Component.extend({
  intercom: inject.service('intercom'),

  // Should be initialized when component is rendered
  category: null,
  searchTerms: null,
  location: null,

  actions: {
    contactUs() {
      get(this, 'intercom').trackEvent('directory-nothing-found-contactus');
      if ('contactUs' in this.attrs) {
        this.attrs.contactUs();
      }
    }
  }
});
