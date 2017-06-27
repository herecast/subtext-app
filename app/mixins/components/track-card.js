import Ember from 'ember';

const {
  get
} = Ember;

export default Ember.Mixin.create({
  actions: {

    trackSuggestedContentClick() {
      if (get(this, 'isSimilarContent')) {
        this.tracking.push({
          'event'         : "VirtualSimilarContentClick",
          'content_id'    : get(this, 'sourceContentId'),
          'content_title' : get(this, 'title')
        });
      }

      return true;
    }
  }
});
