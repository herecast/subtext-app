import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: ['ListservForm'],

  type: null,

  headingText: computed('type', function() {
    const typeData = {
      subscribe: '',
      unsubscribe: 'Unsubscribe from Digest',
      manage: 'Manage your Subscription',
      enhance: 'Enhance your post'
    };

    return typeData[get(this, 'type')];
  })
});
