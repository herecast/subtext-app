import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import normalizeContentType from 'subtext-ui/utils/normalize-content-type';

const { get, RSVP } = Ember;

export default {
  checkFacebookCache(locationService, path) {
    const shareUrl = this.getShareUrl(locationService, path);
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

  getShareUrl(locationService, routeName, model) {
    let shareUrl;

    if (this.isModalRoute(routeName)) {
      let id = get(model, 'id');
      let ctype = normalizeContentType( get(model, '_internalModel.modelName') );

      if (ctype === 'event-instance') {
        ctype = 'events';
      } else if (ctype === 'market-post') {
        ctype = 'market';
      }
      shareUrl = `${locationService.origin()}/${ctype}/${id}`;
    } else if (typeof(routeName) === 'string' && routeName.match(/^\/.*\/.*$/)) {
      //Checks to see if the routeName is actually a valid path
      shareUrl = locationService.origin() + routeName;
    } else {
      let url = locationService.href();
      shareUrl = url.split('?')[0];
    }

    return shareUrl;
  },

  isModalRoute(routeName) {
    const modalRoutes = ['index.show', 'organization-profile.news-item'];

    return modalRoutes.contains(routeName);
  }
};
