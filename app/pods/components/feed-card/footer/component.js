import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
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

  hasSource: notEmpty('locationTagName'),

  showManageButton: computed('canManage', 'fastboot.isFastBoot', function() {
    return get(this, 'canManage') && !get(this, 'fastboot.isFastBoot');
  }),

  showEditButton: computed('canEditIfAllowed', 'fastboot.isFastBoot', function() {
    return get(this, 'canEditIfAllowed') && !get(this, 'fastboot.isFastBoot');
  }),

  dontShowButtons: computed('displayAsPublic', 'showManageButton', 'showEditButton', function() {
    return (!get(this, 'showManageButton') && !get(this, 'showEditButton')) || get(this, 'displayAsPublic');
  }),

  actions: {
    openPromotionMenu() {
      if (this.openPromotionMenu) {
        this.openPromotionMenu();
      }
    }
  }
});
