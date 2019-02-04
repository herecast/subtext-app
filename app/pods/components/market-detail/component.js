import { inject as service } from '@ember/service';
import { reads, alias, oneWay, sort } from '@ember/object/computed';
import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { computed, set, get, setProperties } from '@ember/object';
import { isPresent } from '@ember/utils';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import LaunchingContent from 'subtext-ui/mixins/components/launching-content';
import contentComments from 'subtext-ui/mixins/content-comments';

export default Component.extend(ModelResetScroll, LaunchingContent, contentComments, {
  classNames: ['DetailPage'],
  classNameBindings: ['goingToEdit:going-to-edit'],
  'data-test-component': 'market-detail',
  'data-test-content': reads('model.contentId'),

  fastboot: service(),
  tracking: service(),
  userLocation: service(),

  isPreview: false,
  enableStickyHeader: false,

  model: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      thumbSortDefinition: ['primary:desc'],
      _cachedId: get(this, 'model.id')
    });
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

  activeImage: oneWay('model.primaryOrFirstImage.imageUrl'),

  controller: service('current-controller'),

  showThumbnails: computed('visibleImages.[]', function() {
    return get(this, 'visibleImages.length') > 1;
  }),

  images: alias('model.images'),
  sortedImages: sort('visibleImages', 'thumbSortDefinition'),
  visibleImages: computed('images.@each._delete', function() {
    const images = get(this, 'images');

    return images.rejectBy('_delete');
  }),

  modelContent: computed('model.content', function() {
    return htmlSafe(get(this, 'model.content'));
  }),

  modelSplitContentHead: computed('model.splitContent.head', function() {
    return htmlSafe(get(this, 'model.splitContent.head'));
  }),

  modelSplitContentTail: computed('model.splitContent.tail', function() {
    return htmlSafe(get(this, 'model.splitContent.tail'));
  }),

  showContactButton: computed('model.{contactEmail,contactPhone,sold}', function() {
    if (get(this, 'model.sold')) {
      return false;
    }

    return isPresent(get(this, 'model.contactEmail')) || isPresent(get(this, 'model.contactPhone'));
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
    },

    goingToEdit() {
      set(this, 'goingToEdit', true);
    }
  }
});
