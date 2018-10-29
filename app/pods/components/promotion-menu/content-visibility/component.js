import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'PromotionMenu-ContentVisibility',

  content: null,
  organization: null,
  bizIsOwner: false,

  aboutToUntag: false,

  api: service(),
  store: service(),
  notify: service('notification-messages'),

  viewStatus: alias('content.viewStatus'),

  manageText: computed('content.viewStatus', function() {
    const viewStatus = get(this, 'content.viewStatus');

    return {
      public: 'On Page',
      private: 'Hidden',
      draft: 'Draft',
    }[viewStatus];
  }),

  editRoute: computed('content.contentType', function() {
    const contentType = get(this, 'content.contentType');
    const baseRoute = contentType === 'event' ? 'events' : contentType;

    return `${baseRoute}.edit`;
  }),

  editId: alias('content.contentId'),

  updateVisibility(isVisible) {
    const notify = get(this, 'notify');
    const content = get(this, 'content');

    set(content, 'bizFeedPublic', isVisible);

    content.save().then(
      () => notify.success('Update successful'),
      () => notify.error('Update failed. Please try again.')
    );
  },

  actions: {
    toggleUntag() {
      this.toggleProperty('aboutToUntag');
    },

    hideFromPublic() {
      this.updateVisibility(false);
    },

    showToPublic() {
      this.updateVisibility(true);
    },

    untagContent() {
      const api = get(this, 'api');
      const organizationId = get(this, 'organization.id');
      const contentId = get(this, 'content.id');

      api.removeOrganizationTagOnContent(organizationId, contentId);

      get(this, 'store').unloadRecord(get(this, 'content'));
    }
  }
});
