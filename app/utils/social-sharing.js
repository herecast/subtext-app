import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const { RSVP, get } = Ember;

export default {
  checkFacebookCache(locationService, model) {
    const shareUrl = this.getShareUrl(locationService, model);
    return this.cacheFacebook(shareUrl);
  },

  cacheFacebook(url) {
    return new RSVP.Promise((resolve, reject) => {
      if (url && config.fb_enabled) {
        Ember.$.post('https://graph.facebook.com', {
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

  getShareUrl(locationService, model, detailPageFromProfile=false) {
    const normalizedContentType = get(model, 'normalizedContentType');
    const contentId = get(model, 'contentId');
    const isOrganization = normalizedContentType === 'organization';
    const organizationId = isOrganization ? get(model, 'id') : get(model, 'organizationId');

    let url;

    if (isOrganization) {
      url = `${locationService.origin()}/profile/${organizationId}`;
    } else if (detailPageFromProfile && organizationId) {
      url = `${locationService.origin()}/profile/${organizationId}/${contentId}`;
    } else {
      url = `${locationService.origin()}/feed/${contentId}`;
    }

    if (get(model, 'eventInstanceId')) {
      let additionalParam = get(model, 'eventInstanceId') || get(model, 'id');
      url += `/${additionalParam}`;
    }

    return url;
  },

  isModalRoute(routeName) {
    const modalRoutes = [];

    return modalRoutes.includes(routeName);
  }
};
