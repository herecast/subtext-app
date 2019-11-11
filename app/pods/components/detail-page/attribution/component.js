import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  tracking: service(),

  model: null,
  isPreview: false,

  showContactButton: computed('model.{contactEmail,contactPhone}', function() {
    return isPresent(get(this, 'model.contactEmail')) || isPresent(get(this, 'model.contactPhone'));
  }),

  actions: {
    clickReplyButton() {
      get(this, 'tracking').trackMarketReplyButtonClick();
    }
  }
});
