import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  tracking: service(),

  model: null,
  isPreview: false,
  editButtonIsActive: false,

  hasContactInfo: computed('model.{eventUrl,contactEmail,contactPhone}', function() {
    return isPresent(get(this, 'model.eventUrl')) || isPresent(get(this, 'model.contactEmail')) || isPresent(get(this, 'model.contactPhone'));
  }),

  showContactButton: computed('hasContactInfo', 'model.sold', 'editButtonIsActive', function() {
    if (get(this, 'model.sold') || get(this, 'editButtonIsActive')) {
      return false;
    }

    return isPresent(get(this, 'model.contactEmail')) || isPresent(get(this, 'model.contactPhone'));
  }),

  actions: {
    clickReplyButton() {
      get(this, 'tracking').trackMarketReplyButtonClick();
    }
  }
});
