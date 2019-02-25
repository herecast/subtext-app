import {
  oneWay,
  alias,
  readOnly,
  notEmpty,
  reads
} from '@ember/object/computed';
import $ from 'jquery';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { observer } from '@ember/object';
import CardMetrics from 'subtext-ui/mixins/components/card-metrics';

export default Component.extend(CardMetrics, {
  classNames: 'FeedCard',
  classNameBindings: ['isEditing:show-back', 'showOverlay:show-overlay', 'promotionMenuOpen:promotion-menu-open'],
  'data-test-feed-card': oneWay('model.contentType'),
  'data-test-content': oneWay('model.contentId'),
  'data-test-condensed': oneWay('condensedView'),
  'data-test-entered-viewport': oneWay('_didEnterViewPort'),

  model: null,
  isHiddenFromFeed: readOnly('model.isHiddenFromFeed'),
  organization: null,
  allowManageOnTile: false,
  displayAsPublic: false,
  hideComments: false,
  promotionMenuOpen: false,
  condensedView: false,

  hideCompletely: false,

  session: service(),
  userLocation: service('userLocation'),
  tracking: service(),

  isLoggedIn: alias('session.isAuthenticated'),
  isDraft: readOnly('model.isDraft'),
  hasOrganization: notEmpty('organization'),

  contentType: reads('model.contentType'),
  componentType: computed('contentType', function() {
    let contentType = get(this, 'contentType');

    if (isBlank(contentType) || contentType === 'talk') {
      contentType = 'market';
    }

    return `feed-card/${contentType}-card`;
  }),

  linkToDetailIsActive: true,

  hideFromFeedWatcher: observer('isHiddenFromFeed', function() {
    if (get(this, 'isHiddenFromFeed')) {
      later(() => {
        set(this, 'hideCompletely', true);
      }, 1000);
    }
  }),

  actions: {
    closePromotionMenu() {
      set(this, 'promotionMenuOpen', false);
    },
    openPromotionMenu() {
      const offset = get(this, 'hasOrganization') ? 60 : 107;
      set(this, 'promotionMenuOpen', true);
      $('html, body').animate({
        scrollTop: this.$().offset().top - offset
      }, 250);
    },
    onContentClick() {
      const organization = get(this, 'organization');

      if (organization) {
        get(this, 'tracking').profileContentClick(
          organization,
          get(this, 'model')
        );
      }
    }
  }
});
