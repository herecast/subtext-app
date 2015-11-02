import Ember from 'ember';
import config from '../../config/environment';
import ajax from 'ic-ajax';

export default Ember.Mixin.create({
  facebookRecache: function() {
    ajax('https://graph.facebook.com', {
      type: 'POST',
      data: {
        scrape: true,
        id: window.location.href
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
