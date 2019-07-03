import { get, computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  isWhiteButton: false,

  color: computed('isWhiteButton', function() {
    return get(this, 'isWhiteButton') ? 'secondary' : 'primary';
  }),

  wantsToChangeLocation: false,


  actions: {
    toggleChangeLocation() {
      this.toggleProperty('wantsToChangeLocation');
    }
  }
});
