import Ember from 'ember';

const { get, set, computed, isBlank, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard',
  classNameBindings: ['isEditing:show-back', 'showOverlay:show-overlay'],
  'data-test-feed-card': computed.oneWay('model.normalizedContentType'),
  'data-test-content': computed.oneWay('model.contentId'),

  model: null,
  organization: null,
  canManage: false,
  displayAsPublic: false,
  promotionMenuOpen: false,

  session: service(),
  userLocation: service('userLocation'),
  tracking: service(),

  isLoggedIn: computed.alias('session.isAuthenticated'),

  contentType: computed.reads('model.normalizedContentType'),
  componentType: computed('contentType', function() {
    let contentType = get(this, 'contentType');

    if (isBlank(contentType) || contentType === 'campaign') {
      contentType = 'talk';
    }

    return `feed-card/${contentType}-card`;
  }),

  actions: {
    closePromotionMenu() {
      set(this, 'promotionMenuOpen', false);
    },
    openPromotionMenu() {
      set(this, 'promotionMenuOpen', true);
      Ember.$('html, body').animate({
        scrollTop: this.$().offset().top - 60
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
