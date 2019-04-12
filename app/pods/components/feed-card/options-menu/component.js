import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import ScrollToComments from 'subtext-ui/mixins/components/scroll-to-comments';
import IsDefaultOrganization from 'subtext-ui/utils/is-default-organization';
import Component from '@ember/component';

export default Component.extend(ScrollToComments, {
  classNames: ['FeedCard-OptionsMenu'],

  tracking: service(),
  userLocationService: service('user-location'),

  model: null,
  isOnDetailView: false,

  hasOpenedMenu: false,
  hasViewedContent: false,
  hasViewedLocation: false,
  hasViewedProfile: false,
  hasClickedComment: false,
  hasClickedHideOrg: false,
  hasClickedHideLocation: false,
  hasClickedReportAbuse: false,

  organizationOwnsContent: computed('model.organizationId', function() {
    const organizationId = get(this, 'model.organizationId');

    return isPresent(organizationId) && !IsDefaultOrganization(organizationId);
  }),

  afterHideOrg: function() {},

  _trackEvent(eventName, componentProperty=null) {
    if (isPresent(componentProperty) && !get(this, componentProperty)) {
      const model = get(this, 'model');

      get(this, 'tracking').trackTileOptionsMenuEvent(eventName, get(model, 'contentId'));

      set(this, componentProperty, true);
    }
  },

  actions: {
    afterHideLocation() {
      const content = get(this, 'model');
      set(content, 'isHiddenFromFeed', true);
    },

    onClickOpenMenu() {
      this._trackEvent('UserClicksOptionsMenu', 'hasOpenedMenu');
    },

    onClickViewContent() {
      this._trackEvent('UserClicksToDetail', 'hasViewedContent');
    },

    onClickViewLocation() {
      this._trackEvent('UserClicksToViewLocation', 'hasViewedLocation');

      const location = get(this, 'model.location');

      get(this, 'userLocationService').goToLocationFeed( get(location, 'id') );
    },

    onClickViewProfile() {
      this._trackEvent('UserClicksToProfile', 'hasViewedProfile');
    },

    onClickToComment() {
      this._trackEvent('UserClicksToComment', 'hasClickedComment');

      if (get(this, 'isOnDetailView')) {
        this.scrollToComments();
      }
    },

    onClickHideOrg() {
      this._trackEvent('UserClicksHideOrganization', 'hasClickedHideOrg');
    },

    onClickHideLocation() {
      this._trackEvent('UserClicksHideLocation', 'hasClickedHideLocation');
    },

    onClickReportAbuse() {
      this._trackEvent('UserClicksReportAbuse', 'hasClickedReportAbuse');
    }
  }

});
