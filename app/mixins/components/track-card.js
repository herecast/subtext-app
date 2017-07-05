import Ember from 'ember';

const {
  get,
  inject
} = Ember;

export default Ember.Mixin.create({
  tracking: inject.service(),
  actions: {

    trackSuggestedContentClick() {
      if (get(this, 'isSimilarContent')) {
        get(this, 'tracking').push({
          'event'         : "VirtualSimilarContentClick",
          'content_id'    : get(this, 'sourceContentId'),
          'content_title' : get(this, 'title')
        });
      }

      return true;
    }
  }
});
