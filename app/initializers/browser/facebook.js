import config from 'subtext-ui/config/environment';
/* global FB */

export function initialize() {
  window.fbAsyncInit = function() {
    if (config.fb_enabled && 'FACEBOOK_API_ID' in config && config.FACEBOOK_API_ID) {
      let initOptions = {
        appId   : config['FACEBOOK_API_ID'],
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
