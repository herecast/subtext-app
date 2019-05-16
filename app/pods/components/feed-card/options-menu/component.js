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
