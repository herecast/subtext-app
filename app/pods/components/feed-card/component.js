import Ember from 'ember';
import CardMetrics from 'subtext-ui/mixins/components/card-metrics';

const { get, set, computed, isBlank, inject:{service} } = Ember;

export default Ember.Component.extend(CardMetrics, {
  classNames: 'FeedCard',
  classNameBindings: ['isEditing:show-back', 'showOverlay:show-overlay', 'promotionMenuOpen:promotion-menu-open'],
  'data-test-feed-card': computed.oneWay('model.normalizedContentType'),
  'data-test-content': computed.oneWay('model.contentId'),
  'data-test-condensed': computed.oneWay('condensedView'),
  'data-test-entered-viewport': computed.oneWay('_didEnterViewPort'),

  model: null,
  organization: null,
  canManage: false,
  displayAsPublic: false,
  hideComments: false,
  promotionMenuOpen: false,
  condensedView: false,

  session: service(),
  userLocation: service('userLocation'),
  tracking: service(),

  isLoggedIn: computed.alias('session.isAuthenticated'),
  isListserv: computed.readOnly('model.isListserv'),
  isDraft: computed.readOnly('model.isDraft'),
  hasOrganization: computed.notEmpty('organization'),

  contentType: computed.reads('model.normalizedContentType'),
  componentType: computed('contentType', function() {
    let contentType = get(this, 'contentType');

    if (isBlank(contentType)) {
      contentType = 'talk';
    }

    return `feed-card/${contentType}-card`;
  }),

  linkToDetailIsActive: computed('isLoggedIn', 'isListserv', 'isDraft', function() {
    const isListserv = get(this, 'isListserv');
    const isNotLoggedIn = !get(this, 'isLoggedIn');
    const isDraft = get(this, 'isDraft');

    if (  (isListserv && isNotLoggedIn) || isDraft ) {
      return false;
    }

    return true;
  }),

  actions: {
    closePromotionMenu() {
      set(this, 'promotionMenuOpen', false);
    },
    openPromotionMenu() {
      const offset = get(this, 'hasOrganization') ? 60 : 107;
      set(this, 'promotionMenuOpen', true);
      Ember.$('html, body').animate({
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
