import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  displayAsAdminIfAllowed: true,
  onUpdate(){},

  actions: {
    toggleAdminCards() {
      this.toggleProperty('displayAsAdminIfAllowed');
      this.onUpdate(get(this, 'displayAsAdminIfAllowed'));
    }
  }
});
