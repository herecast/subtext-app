import Ember from 'ember';

export default Ember.Component.extend({
  wantsToChangeLocation: false,

  actions: {
    toggleChangeLocation() {
      this.toggleProperty('wantsToChangeLocation');
    }
  }
});
