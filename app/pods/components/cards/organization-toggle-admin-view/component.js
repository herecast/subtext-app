import Ember from 'ember';

const {get} = Ember;

export default Ember.Component.extend({
  displayAsAdminIfAllowed: true,
  onUpdate(){},

  actions: {
    toggleAdminCards() {
      this.toggleProperty('displayAsAdminIfAllowed');
      this.onUpdate(get(this, 'displayAsAdminIfAllowed'));
    }
  }
});
