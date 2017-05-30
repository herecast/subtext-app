import Ember from 'ember';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
/* global dataLayer */

const {
  get,
  set,
  computed,
  isPresent,
  inject
} = Ember;

export default Ember.Component.extend(ModelResetScroll, {
  closeRoute: 'market.all',
  closeLabel: 'Market',
  fastboot: inject.service(),
  api: inject.service(),

  _trackImpression() {
    const id = get(this, 'model.contentId');

    if(!get(this, 'fastboot.isFastBoot')) {
      get(this, 'api').recordContentImpression(
        id
      );
    }
  },
 
  didInsertElement() {
    this._super(...arguments);
    this._trackImpression();
  },


  activeImage: computed.oneWay('model.coverImageUrl'),

  controller: inject.service('current-controller'),
  intercom: inject.service(),
  featureFlags: inject.service('feature-flags'),

  showThumbnails: computed('model.images.[]', function() {
    return get(this, 'model.images.length') > 1;
  }),

  thumbSortDefinition: ['primary:desc'],
  sortedImages: computed.sort('model.images.[]', 'thumbSortDefinition'),

  resetProperties() {
    set(this, 'activeImage', get(this, 'model.coverImageUrl'));
  },

  didUpdateAttrs(changes) {
    this._super(...arguments);

    this.resetProperties();

    const newId = get(changes, 'newAttrs.model.value.id');
    if(isPresent(newId)) {
      const oldId = get(changes, 'oldAttrs.model.value.id');
      if(newId !== oldId) {
        // we have a different model now
        this._trackImpression();
      }
    }
  },

  _trackMarketDigestSubscriptionClick(version, title) {
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'market-digest-subscribe',
        'type': 'click',
        'title': title,
        'version': version
      });
    }
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
      get(this, 'model').loadContactInfo();

      get(this, 'intercom').trackEvent('market-reply-click');

      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event': 'market-reply-click'
        });
      }
    }
  }
});
