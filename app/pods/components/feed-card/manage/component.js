import Component from '@ember/component';

export default Component.extend({
  classNames: 'FeedCard-Manage',
  classNameBindings: ['noBorder:no-border', 'editButtonIsActive:is-active'],

  model: null,
  editButtonIsActive:false,
  manageMessage: 'Manage',

  openPromotionMenu(){},

  actions: {
    openPromotionMenu() {
      if (this.openPromotionMenu) {
        this.openPromotionMenu();
      }
    }
  }
});
