import Ember from 'ember';
import config from '../../config/environment';
import ajax from 'ic-ajax';

export default Ember.Mixin.create({
  facebookRecache: function(share_path) {
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
    ajax('https://graph.facebook.com', {
      type: 'POST',
      data: {
        scrape: true,
        id: share_url
      }
    });
  },

  prerenderRecache: function() {
    const prerenderToken = config['prerender-io-token'];
    ajax('http://api.prerender.io/recache', {
      type: 'POST',
      data: {
        prerenderToken: prerenderToken,
        url: window.location.href
      }
    }).then(this.facebookRecache);
    // note -- we're calling facebook recache after re-caching on prerender so that
    // FB caches the latest updates
  }
});
