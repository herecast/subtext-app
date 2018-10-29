import { inject as service } from '@ember/service';
import { reads, oneWay, sort } from '@ember/object/computed';
import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { computed, set, get, setProperties } from '@ember/object';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import contentComments from 'subtext-ui/mixins/content-comments';

export default Component.extend(ModelResetScroll, contentComments, {
  'data-test-component': 'market-detail',
  'data-test-content': reads('model.contentId'),

  closeRoute: 'feed',
  closeLabel: 'Market',

  fastboot: service(),
  tracking: service(),
  userLocation: service(),

  isPreview: false,
  enableStickyHeader: false,
  editPath: 'market.edit',
  model: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      thumbSortDefinition: ['primary:desc']
    });
    this._cachedId = get(this, 'model.id');
  },

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

  modelContent: computed('model.content', function() {
    return htmlSafe(get(this, 'model.content'));
  }),

  activeImage: oneWay('model.primaryOrFirstImage.imageUrl'),

  controller: service('current-controller'),

  showThumbnails: computed('model.images.[]', function() {
    return get(this, 'model.images.length') > 1;
  }),


  sortedImages: sort('visibleImages', 'thumbSortDefinition'),
  visibleImages: computed('model.images.[]', function() {
    const images = get(this, 'model.images');

    return images.rejectBy('_delete');
  }),

  showEditButton: computed('model.canEdit', 'fastboot.isFastBoot', 'isPreview', function() {
    return get(this, 'model.canEdit') && ! get(this, 'isPreview') && ! get(this, 'fastboot.isFastBoot');
  }),

  hideContactButton: computed('model.sol', 'showEditButton', function() {
    return get(this, 'model.sol') || get(this, 'showEditButton');
  }),

  _resetProperties() {
    set(this, 'activeImage', get(this, 'model.coverImageUrl'));
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (this._cachedId !== get(this, 'model.id')) {
      this._trackImpression();
      this._cachedId = get(this, 'model.id');
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
