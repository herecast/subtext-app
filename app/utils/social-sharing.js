import $ from 'jquery';
import RSVP from 'rsvp';
import { get } from '@ember/object';
import config from 'subtext-app/config/environment';

export default {
  checkFacebookCache(locationService, model) {
    const shareUrl = this.getShareUrl(locationService, model);
    return this.cacheFacebook(shareUrl);
  },

  cacheFacebook(url) {
    return new RSVP.Promise((resolve, reject) => {
      if (url && config.fb_enabled) {
        $.post('https://graph.facebook.com', {
          scrape: true,
          id: url
        }).always((xhr) => {
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

  getShareUrl(locationService, model) {
    const contentId = get(model, 'contentId');

    let url = `${locationService.origin()}/${contentId}`;

    if (model.constructor.modelName === 'event-instance') {
      let additionalParam = get(model, 'id');
      url += `/${additionalParam}`;
    }

    return url;
  },

  isModalRoute(routeName) {
    const modalRoutes = [];

    return modalRoutes.includes(routeName);
  }
};
