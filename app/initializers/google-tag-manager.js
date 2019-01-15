import { inject as service } from '@ember/service';
import { warn } from '@ember/debug';
import { get } from '@ember/object';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import config from 'subtext-ui/config/environment';

export function initialize(application) {
  if (typeof FastBoot === 'undefined') {

    const gtmId      = config['GTM_API_TOKEN'] || null;
    const gtmAuth    = config['GTM_AUTH'] || null;
    const gtmPreview = config['GTM_PREVIEW'] || null;

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

      const Router = application.__container__.lookup('router:main');

      Router.reopen({
        session: service(),
        tracking: service(),
        currentController: service(),

        notifyGoogleTagManager: on('didTransition', function() {
          // Wrap in run.later so that the page title is available
          return run.later(() => {
            get(this, 'tracking').trackVirtualPageview(get(this, 'url'));
          });
        })
      });
    } else {
      warn('Not all GTM environment variables have been set. Make sure gtmID, gtmAuth, and gtmPreview have been set to enable tracking.', false, { id: 'gtm-initializer/setting-config-variables'});
    }
  }
}

export default {
  name: 'google-tag-manager',
  after: 'meta-config',
  initialize
};
