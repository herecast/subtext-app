import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Footer',

  fastboot: service(),
  session: service(),

  locationTagName: null,
  canEdit: false,
  canManage: false,
  contentId: null,
  editRoute: null,
  editRouteId: null,
  displayAsPublic: false,
  openPromotionMenu(){},

  hasSource: computed.notEmpty('locationTagName'),

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
