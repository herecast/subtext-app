import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import normalizeContentType from 'subtext-ui/utils/normalize-content-type';

const { get, RSVP } = Ember;

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

  getShareUrl(routeName, model) {
    let shareUrl;

    if (this.isModalRoute(routeName)) {
      let id = get(model, 'id');
      let ctype = normalizeContentType( get(model, '_internalModel.modelName') );

      if (ctype === 'event-instance') {
        ctype = 'events';
      } else if (ctype === 'market-post') {
        ctype = 'market';
      }
      shareUrl = `${location.protocol}//${location.host}/${ctype}/${id}`;
    } else if (typeof(routeName) === 'string' && routeName.match(/^\/.*\/.*$/)) {
      //Checks to see if the routeName is actually a valid path
      shareUrl = window.location.origin + routeName;
    } else {
      shareUrl = window.location.href;
    }

    return shareUrl;
  },

  isModalRoute(routeName) {
    const modalRoutes = ['index.show'];

    return modalRoutes.contains(routeName);
  }
};
