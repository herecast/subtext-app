import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  floatingActionButton: service(),

  displayAsAdminIfAllowed: true,
  onUpdate(){},

  actions: {
    toggleAdminCards() {
      this.toggleProperty('displayAsAdminIfAllowed');
      this.onUpdate(get(this, 'displayAsAdminIfAllowed'));
    },

    openOrangeButton() {
      get(this, 'floatingActionButton').expand();
    }
  }
});
