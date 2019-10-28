import { get, set } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import ScrollToComments from 'subtext-app/mixins/components/scroll-to-comments';
import Component from '@ember/component';

export default Component.extend(ScrollToComments, {
  classNames: ['FeedCard-OptionsMenu'],
  'data-test-card-options-menu': true,

  router: service(),
  tracking: service(),
  userLocationService: service('user-location'),

  model: null,
  isOnDetailView: false,

  caster: readOnly('model.caster'),
  casterIsCurrentUser: readOnly('caster.isCurrentUser'),

  hasOpenedMenu: false,
  hasClickedHideCaster: false,
  hasClickedHideLocation: false,
  hasClickedReportAbuse: false,
  afterHide: null,

  afterHideCaster : function() {},

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

    afterHideCaster() {
      if (get(this, 'afterHide')) {
        get(this, 'afterHide')();
      }
    },

    onClickOpenMenu() {
      this._trackEvent('UserClicksOptionsMenu', 'hasOpenedMenu');
    },

    onClickHideCaster() {
      this._trackEvent('UserClicksHideCaster', 'hasClickedHideCaster');
    },

    onClickHideLocation() {
      this._trackEvent('UserClicksHideLocation', 'hasClickedHideLocation');
    },

    onClickReportAbuse() {
      this._trackEvent('UserClicksReportAbuse', 'hasClickedReportAbuse');
    }
  }

});
