import Service from '@ember/service';

export default Service.extend({

  getComments(contentId) {
    return this.store.query('comment', {
      content_id: contentId
    });
  }
});
