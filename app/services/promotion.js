import Ember from 'ember';
import config from '../config/environment';
import ajax from 'ic-ajax';

export default Ember.Service.extend({
  find(contentId) {
    const promotionUrl = `/${config.API_NAMESPACE}/contents/${contentId}/related_promotion`;

    return new Ember.RSVP.Promise((resolve) => {
      ajax(promotionUrl).then((response) => {
        resolve(response.related_promotion);
      });
    });
  }
});