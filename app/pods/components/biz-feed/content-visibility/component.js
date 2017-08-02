import Ember from 'ember';

const { get, set, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'BizFeed-ContentVisibility',

  content: null,
  organization: null,
  bizIsOwner: false,

  aboutToUntag: false,

  api: service(),
  store: service(),

  viewStatus: computed.alias('content.viewStatus'),

  _setContentStatus(data) {
    const organizationId = get(this, 'organization.id');
    const contentId = get(this, 'content.id');
    return get(this, 'api').setOrganizationContentStatus(organizationId, contentId, data);
  },

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

  editId: computed('content.contentType', function() {
    const contentType = get(this, 'content.contentType');

    return contentType === 'event' ? get(this, 'content.eventId') : get(this, 'content.contentId');
  }),

  actions: {
    toggleUntag() {
      this.toggleProperty('aboutToUntag');
    },

    hideFromPublic() {
      const data = {
        biz_feed_public: false
      };

      set(this, 'content.bizFeedPublic', false);

      this._setContentStatus(data);
    },

    showToPublic() {
      const data = {
        biz_feed_public: true
      };

      set(this, 'content.bizFeedPublic', true);

      this._setContentStatus(data);
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
