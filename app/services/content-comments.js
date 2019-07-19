import { get } from '@ember/object';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  fastboot: service(),

  getComments(contentId) {
    if (get(this, 'fastboot.isFastBoot')) {
      return [];
    } else {
      return this.store.query('comment', {
        content_id: contentId
      });
    }
  }
});
