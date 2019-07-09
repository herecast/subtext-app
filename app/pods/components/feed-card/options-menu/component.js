import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import ScrollToComments from 'subtext-app/mixins/components/scroll-to-comments';
import IsDefaultOrganization from 'subtext-app/utils/is-default-organization';
import Component from '@ember/component';

export default Component.extend(ScrollToComments, {
  classNames: ['FeedCard-OptionsMenu'],
  'data-test-card-options-menu': true,

  router: service(),
  tracking: service(),
  userLocationService: service('user-location'),

  model: null,
  isOnDetailView: false,

  hasOpenedMenu: false,
  hasClickedHideOrg: false,
  hasClickedHideLocation: false,
  hasClickedReportAbuse: false,
  afterHide: null,

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
      if (get(this, 'afterHide')) {
        get(this, 'afterHide')();
      }
    },

    afterHideOrg() {
      if (get(this, 'afterHide')) {
        get(this, 'afterHide')();
      }
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
