import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Service.extend({
  api: inject.service('api'),

  find(contentId) {
    const api = get(this, 'api');

    return new Ember.RSVP.Promise((resolve) => {
      api.getContentPromotion(contentId).then((response) => {
        resolve(response.related_promotion);
      });
    });
  }
});
