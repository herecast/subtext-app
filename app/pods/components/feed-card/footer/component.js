import Ember from 'ember';

const {get, computed, inject} = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Footer',

  fastboot: inject.service(),

  locationTagName: null,
  canEdit: false,
  canManage: false,
  contentId: null,
  editRoute: null,
  editRouteId: null,
  displayAsPublic: false,
  openPromotionMenu(){},

  hasSource: computed.notEmpty('locationTagName'),

  showEditButton: computed('canEdit', 'fastboot.isFastBoot', function() {
    return get(this, 'canEdit') && !get(this, 'fastboot.isFastBoot');
  }),

  showManageButton: computed('canManage', 'fastboot.isFastBoot', function() {
    return get(this, 'canManage') && !get(this, 'fastboot.isFastBoot');
  }),

  actions: {
    openPromotionMenu() {
      if (this.openPromotionMenu) {
        this.openPromotionMenu();
      }
    }
  }
});
