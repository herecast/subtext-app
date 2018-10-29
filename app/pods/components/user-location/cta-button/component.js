import Component from '@ember/component';

export default Component.extend({
  wantsToChangeLocation: false,

  actions: {
    toggleChangeLocation() {
      this.toggleProperty('wantsToChangeLocation');
    }
  }
});
