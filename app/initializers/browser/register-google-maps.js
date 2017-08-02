/* global google */

export default {
  name: 'register-google-maps',

  // So that we can avoid using the google global variable
  // in the app, this initializer makes it possible to inject the
  // google maps service.
  initialize: function(application) {
    if(typeof(google) !== 'undefined') {
      application.register('google-maps:main', google, { instantiate: false });
      application.inject('service:google-maps', 'googleMaps', 'google-maps:main');
    }
  }
};
