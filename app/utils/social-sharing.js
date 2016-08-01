import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const { RSVP } = Ember;

export default {
  createShareCache(path) {
    const shareUrl = this.getShareUrl(path);
    return this.cachePrerender(shareUrl);
  },

  updateShareCache(path) {
    const shareUrl = this.getShareUrl(path);
    return this.cachePrerender(shareUrl);
  },

  checkFacebookCache(path) {
    const shareUrl = this.getShareUrl(path);
    return this.cacheFacebook(shareUrl);
  },

  cacheFacebook(url) {
    return new RSVP.Promise((resolve, reject) => {
      if (url && config.fb_enabled) {
        Ember.$.post('https://graph.facebook.com', {
          scrape: true,
          id: url
        }, (response, status, xhr) => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(`Facebook returned ${xhr.status}`);
          }
        });
      } else {
        reject('Facebook sharing not enabled');
      }
    });
  },

  cachePrerender(url) {
    return new RSVP.Promise((resolve, reject) => {
      const prerenderToken = config['prerender-io-token'];
      if (url && prerenderToken && config.prerender_enabled) {

        //Will return 500 if url is invalid (e.g. has localhost in url)
        Ember.$.post('https://api.prerender.io/recache', {
          prerenderToken: prerenderToken,
          url: url
        }, (response) => {
          if (response === 'OK') {
            resolve();
          } else {
            reject('Prerender did not accept request');
          }
        });
      } else {
        reject('Prerender unavailable');
      }
    });
  },

  getShareUrl(path) {
    let shareUrl;

    if (typeof(path) === 'string' && path.match(/^\/.*\/.*$/)) {
      shareUrl = window.location.origin + path;
    } else {
      shareUrl = window.location.href;
    }
    
    return shareUrl;
  }
};
