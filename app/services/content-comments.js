import Ember from 'ember';

export default Ember.Service.extend({

  getComments: function(contentId) {
    return this.store.find('comment', {
      parentContentId: contentId
    });
  }
});