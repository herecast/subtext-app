import config from 'subtext-ui/config/environment';
/* global FB */

export function initialize() {
  window.fbAsyncInit = function() {
    if (config.fb_enabled) {
      let initOptions = {
        appId   : config['facebook-app-id'],
        xfbml   : true,
        version : 'v2.4'
      };
      FB.init(initOptions);
    }
  };
}

export default {
  name: 'facebook',
  initialize: initialize
};
