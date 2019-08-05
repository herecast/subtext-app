import { get, computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  model: null,
  isPreview: false,
  editButtonIsActive: false,
  afterHide: null,

  showToggleSold: computed('isPreview', 'editButtonIsActive', 'model.isMarket', function() {
    if (get(this, 'isPreview')) {
      return false;
    }

    return get(this, 'editButtonIsActive') && get(this, 'model.isMarket');
  })
});
