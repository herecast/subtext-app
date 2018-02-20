import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Component.extend({
  classNames: ['SmallCard'],
  tracking: inject.service(),

  isSimilarContent: false,

  actions: {
    trackClick(content) {
      if (get(this, 'isSimilarContent')) {
        get(this, 'tracking').push({
          'event'         : "VirtualSimilarContentClick",
          'content_id'    : get(content, 'id'),
          'content_title' : get(content, 'title')
        });
      }
    }
  }
});
