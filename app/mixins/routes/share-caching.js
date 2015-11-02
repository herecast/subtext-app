import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Mixin.create({
  facebookRecache: function() {
    Ember.$.post('https://graph.facebook.com', {
      scrape: true,
      id: window.location.href
    });
  },

  prerenderRecache: function() {
    const prerenderToken = config['prerender-io-token'];
    Ember.$.post('http://api.prerender.io/recache', {
      prerenderToken: prerenderToken,
      url: window.location.href
    }, function() {
      // call facebook recache after re-caching on prerender so that
      // FB caches the latest updates
      this.facebookRecache();
    }.bind(this));
  }
});
