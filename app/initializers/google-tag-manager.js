import config from 'subtext-ui/config/environment';
import Ember from 'ember';
/* global dataLayer */

export function initialize(container) {
  const { get, run } = Ember;
  const propertyId = config['gtm-api-token'] || null;

  if (propertyId) {
    /* jshint ignore:start */
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', propertyId);
    /* jshint ignore:end */
  }

  if (propertyId) {
    const Router = container.lookup('router:main');

    Router.reopen({
      notifyGoogleTagManager: function() {
        // Wrap in run.later so that the page title is available
        run.later(() => {
          if (typeof dataLayer !== "undefined") {
            return dataLayer.push({
              'event':'VirtualPageview',
              'virtualPageURL': get(this, 'url'),
              'virtualPageTitle' : document.title
            });
          }
        });
      }.on('didTransition')
    });
  } else {
    console.log('No GTM environment variable has been set. Set a GTM tracking code to enable tracking.');
  }
}

export default {
  name: 'google-tag-manager',
  after: 'meta-config',
  initialize
};
