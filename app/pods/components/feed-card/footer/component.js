import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Footer',

  fastboot: service(),
  session: service(),

  locationTagName: null,
  canEditIfAllowed: false,
  canManage: false,
  contentId: null,
  editPath: null,
  editPathId: null,
  displayAsPublic: false,
  openPromotionMenu(){},

  hasSource: computed.notEmpty('locationTagName'),

  showManageButton: computed('canManage', 'fastboot.isFastBoot', function() {
    return get(this, 'canManage') && !get(this, 'fastboot.isFastBoot');
  }),

  showEditButton: computed('canEditIfAllowed', 'fastboot.isFastBoot', function() {
    return get(this, 'canEditIfAllowed') && !get(this, 'fastboot.isFastBoot');
  }),

  dontShowButtons: computed('showManageButton', 'showEditButton', function() {
    return !get(this, 'showManageButton') && !get(this, 'showEditButton');
  }),

  actions: {
    openPromotionMenu() {
      if (this.openPromotionMenu) {
        this.openPromotionMenu();
      }
    }
  }
});
