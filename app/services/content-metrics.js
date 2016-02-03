import Ember from 'ember';
import config from '../config/environment';
import ajax from 'ic-ajax';
import ContentMetric from '../models/content-metric';
import AdMetric from '../models/ad-metric';

export default Ember.Service.extend({
  findContent(id) {
    const url = `${config.API_NAMESPACE}/contents/${id}/metrics`;
    return ajax(url).then((response) => {
      return ContentMetric.create(response.content_metrics);
    });
  },
  findAd(id){
    const url = `${config.API_NAMESPACE}/promotion_banners/${id}/metrics`;
    return ajax(url).then((response) => {
      return AdMetric.create(response.promotion_banner_metrics);
    });
  }
});
