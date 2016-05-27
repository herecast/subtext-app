import config from 'subtext-ui/config/environment';
import Ember from 'ember';
/* global dataLayer */

const { on } = Ember;

let referrer = window.location.href;

export function initialize(container) {
  const { get, run } = Ember;
  const gtmId      = config['gtm-api-token'] || null;
  const gtmAuth    = config['gtm-auth'] || null;
  const gtmPreview = config['gtm-preview'] || null;

  if (gtmId && gtmAuth && gtmPreview) {
    /* jshint ignore:start */
    (function(w,d,s,l,i, gtmAuth, gtmPreview) {
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl = l != 'dataLayer' ? `&l=${l}` : '';
          j.async=true;
          j.src=`//www.googletagmanager.com/gtm.js?id=${i}${dl}&gtm_auth=${gtmAuth}&gtm_preview=${gtmPreview}&gtm_cookies_win=x`;
          f.parentNode.insertBefore(j,f);
    })(window, document, 'script', 'dataLayer', gtmId, gtmAuth, gtmPreview);
    /* jshint ignore:end */

    const Router = container.lookup('router:main');

    Router.reopen({
      notifyGoogleTagManager: on('didTransition', function() {
        // Wrap in run.later so that the page title is available
        return run.later(() => {
          if (typeof dataLayer !== "undefined") {
            const currentUrl = window.location.href;

            dataLayer.push({
              'event':'VirtualPageview',
              'virtualPageURL': get(this, 'url'),
              'virtualPageTitle': document.title,
              'VirtualPageReferrer': referrer
            });

            referrer = currentUrl;
          }
        });
      })
    });
  } else {
    Ember.warn('Not all GTM environment variables have been set. Make sure gtmID, gtmAuth, and gtmPreview have been set to enable tracking.', false, { id: 'gtm-initializer/setting-config-variables'});
  }
}

export default {
  name: 'google-tag-manager',
  after: 'meta-config',
  initialize
};
