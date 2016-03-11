import Ember from 'ember';

const { inject, get, computed: { alias } } = Ember;

export default Ember.Controller.extend({
  directoryController: inject.controller('directory'),
  intercom:    inject.service('intercom'),
  category:    alias('directoryController.category'),
  searchTerms: alias('directoryController.searchTerms'),
  location:    alias('directoryController.location'),

  actions: {
    contactUs() {
      get(this, 'directoryController').send('contactUs');
      get(this, 'intercom').trackEvent('directory-nothing-found-contactus');
    }
  }
});
