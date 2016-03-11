import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Controller.extend({
  directoryController: inject.controller('directory'),
  actions: {
    contactUs() {
      get(this, 'directoryController').send('contactUs');
      get(this, 'intercom').trackEvent('directory-nothing-found-contactus');
    }
  }
});
