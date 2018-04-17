import Ember from 'ember';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import contentComments from 'subtext-ui/mixins/content-comments';

const {
  get,
  set,
  computed,
  isPresent,
  inject
} = Ember;

export default Ember.Component.extend(ModelResetScroll, contentComments, {
  'data-test-component': 'market-detail',
  'data-test-content': computed.reads('model.contentId'),
  closeRoute: 'feed',
  closeLabel: 'Market',
  fastboot: inject.service(),
  tracking: inject.service(),
  userLocation: inject.service('user-location'),
  isPreview: false,
  enableStickyHeader: false,
  editPath: 'market.edit',

  trackDetailEngagement: function() {},

  _trackImpression() {
    const id = get(this, 'model.contentId');

    if(!get(this, 'fastboot.isFastBoot') && !(get(this, 'isPreview'))) {
      get(this, 'tracking').contentImpression(
        id
      );
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._trackImpression();
  },

  activeImage: computed.oneWay('model.primaryOrFirstImage.imageUrl'),

  controller: inject.service('current-controller'),
  featureFlags: inject.service('feature-flags'),

  showThumbnails: computed('model.images.[]', function() {
    return get(this, 'model.images.length') > 1;
  }),

  thumbSortDefinition: ['primary:desc'],
  sortedImages: computed.sort('model.images.[]', 'thumbSortDefinition'),

  showEditButton: computed('model.canEdit', 'fastboot.isFastBoot', 'isPreview', function() {
    return get(this, 'model.canEdit') && ! get(this, 'isPreview') && ! get(this, 'fastboot.isFastBoot');
  }),

  _resetProperties() {
    set(this, 'activeImage', get(this, 'model.coverImageUrl'));
  },

  didUpdateAttrs(changes) {
    this._super(...arguments);

    this._resetProperties();

    const newId = get(changes, 'newAttrs.model.value.id');
    if(isPresent(newId)) {
      const oldId = get(changes, 'oldAttrs.model.value.id');
      if(newId !== oldId) {
        this._trackImpression();
      }
    }
  },

  _trackMarketDigestSubscriptionClick(version, title) {
    get(this, 'tracking').push({
      'event': 'market-digest-subscribe',
      'type': 'click',
      'title': title,
      'version': version
    });
  },

  actions: {
    subscribeToMarketDigest() {
      const controller = get(this, 'controller.currentController');
      const marketDigestId = get(this, 'featureFlags.market-index-subscribe-cta.options.digest-id');
      const title = get(this, 'featureFlags.market-index-subscribe-cta.options.title');
      const version  = get(this, 'featureFlags.market-index-subscribe-cta.options.version');

      this._trackMarketDigestSubscriptionClick(version, title);

      controller.transitionToRoute('register', {
        queryParams: {
          selectedDigest: marketDigestId
        }
      });
    },

    chooseImage(imageUrl) {
      set(this, 'activeImage', imageUrl);
    },

    clickReplyButton() {
      get(this, 'tracking').push({
        'event': 'market-reply-click'
      });
    }
  }
});
