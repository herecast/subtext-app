import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Service.extend({
  api: inject.service(),

  find(contentId) {
    return new Ember.RSVP.Promise(resolve => {
      get(this, 'api').getContentPromotion(contentId).then(response => {
        resolve(response.promotion);
      });
    });
  }
});
