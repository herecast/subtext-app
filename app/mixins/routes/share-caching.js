import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import config from '../../config/environment';

export default Mixin.create({
  facebookRecache: function(share_path) {
    if (config.fb_enabled) {
      var share_url;
      // I'm trying to use share_path as an optional argument, but it seems that
      // when the function is called from a callback, it sometimes has an argument
      // automatically given to it. So these conditionals check if the incoming
      // argument is a path -- if not, we just use window.location.href
      if (typeof(share_path) === 'string' && share_path.match(/^\/.*\/.*$/)) {
        share_url = window.location.origin + share_path;
      } else {
        share_url = window.location.href;
      }
      $.post('https://graph.facebook.com', {
        scrape: true,
        id: share_url
      });
    }
  }
});
