import config from 'subtext-ui/config/environment';
/* global FB */

export function initialize() {
  window.fbAsyncInit = function() {
    FB.init({
      appId   : config['facebook-app-id'],
      xfbml   : true,
      version : 'v2.4'
    });
  };
}

export default {
  name: 'facebook',
  initialize: initialize
};
