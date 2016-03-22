import Ember from 'ember';
import ContentMetric from '../models/content-metric';
import AdMetric from '../models/ad-metric';

const { get, inject } = Ember;

export default Ember.Service.extend({
  api: inject.service('api'),

  findContent(id, data) {
    const api = get(this, 'api');

    return api.getContentMetrics(id, data).then((response) => {
      return ContentMetric.create(response.content_metrics);
    });
  },

  findAd(id, data){
    const api = get(this, 'api');

    return api.getPromotionBannerMetrics(id, data).then((response) => {
      return AdMetric.create(response.promotion_banner_metrics);
    });
  }
});
