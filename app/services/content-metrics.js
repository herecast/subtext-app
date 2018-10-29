import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';
import ContentMetric from '../models/content-metric';
import AdMetric from '../models/ad-metric';

export default Service.extend({
  api: service('api'),

  findContent(id, data) {
    const api = get(this, 'api');

    return api.getContentMetrics(id, data).then((response) => {
      return ContentMetric.create(response.content_metrics);
    });
  },

  findOrganizationContentMetrics(organizationId, data) {
    const api = get(this, 'api');

    return api.getOrganizationContentMetrics(organizationId, data).then((response) => {
      return ContentMetric.create(response.content_metrics);
    });
  },

  findUserContentMetrics(userId, data) {
    const api = get(this, 'api');

    return api.getCurrentUserContentMetrics(userId, data).then((response) => {
      return ContentMetric.create(response.content_metrics);
    });
  },

  findAd(id, data){
    const api = get(this, 'api');

    return api.getPromotionBannerMetrics(id, data).then((response) => {
      return AdMetric.create(response.promotion_banner_metrics);
    });
  },

  getMetrics(type, id, data) {  
    if (type === 'campaign') {
      return this.findAd(id, data);
    } else if (type === 'organization') {
      return this.findOrganizationContentMetrics(id, data);
    } else if (type === 'current-user') {
      return this.findUserContentMetrics(id, data);
    }  else {
      return this.findContent(id, data);
    }
  }
});
