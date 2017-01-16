import Ember from 'ember';
/* global dataLayer */

const {
  get
} = Ember;

export default Ember.Mixin.create({
  actions: {

    trackSuggestedContentClick() {
      if (get(this, 'isSimilarContent')) {
        if (typeof dataLayer !== "undefined") {
          dataLayer.push({
            'event'         : "VirtualSimilarContentClick",
            'content_id'    : get(this, 'sourceContentId'),
            'content_title' : get(this, 'title')
          });
        }
      }

      return true;
    }
  }
});
