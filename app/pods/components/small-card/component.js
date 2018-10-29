import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  classNames: ['SmallCard'],
  tracking: service(),

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
