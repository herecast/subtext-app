import Ember from 'ember';

export default Ember.Service.extend({

  getComments(contentId) {
    return this.store.query('comment', {
      content_id: contentId
    });
  }
});
