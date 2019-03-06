import { inject as service } from '@ember/service';
import { reads, alias, oneWay, sort, gt } from '@ember/object/computed';
import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { computed, get, set, setProperties } from '@ember/object';
import { htmlSafe } from '@ember/template';
import LaunchingContent from 'subtext-ui/mixins/components/launching-content';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import IsDefaultOrganization from 'subtext-ui/utils/is-default-organization';
import contentComments from 'subtext-ui/mixins/content-comments';

export default Component.extend(ModelResetScroll, LaunchingContent, contentComments, {
  'data-test-component': 'event-detail',
  'data-test-content': reads('model.contentId'),
  classNames: ['DetailPage'],
  classNameBindings: ['isPreview:isPreview', 'goingToEdit:going-to-edit'],

  fastboot: service(),
  tracking: service(),
  store: service(),

  model: null,
  closeRoute: 'events',
  closeLabel: 'Events',
  editPath:   'events.edit',
  isPreview: false,
  enableStickyHeader: false,
  goingToEdit: false,

  init() {
    this._super(...arguments);

    setProperties(this, {
      thumbSortDefinition: ['primary:desc'],
      _cachedModelId: get(this, 'model.id')
    });

    this._checkIfLaunchingContent();
  },

  editPathId: oneWay('model.contentId'),

  trackDetailEngagement: function() {},

  modelContent: computed('model.content', function() {
    return htmlSafe(get(this, 'model.content'));
  }),

  modelSplitContentHead: computed('model.splitContent.head', function() {
    return htmlSafe(get(this, 'model.splitContent.head'));
  }),

  modelSplitContentTail: computed('model.splitContent.tail', function() {
    return htmlSafe(get(this, 'model.splitContent.tail')) || '';
  }),

  hasSplitContentTail: gt('modelSplitContentTail.length', 0),

  showContactButton: computed('model.{contactEmail,contactPhone,sold}', 'editButtonIsActive', function() {
    if (get(this, 'model.sold') || get(this, 'editButtonIsActive')) {
      return false;
    }

    return isPresent(get(this, 'model.contactEmail')) || isPresent(get(this, 'model.contactPhone'));
  }),

  _trackImpression() {
    const id = get(this, 'model.contentId');

    if(!get(this, 'fastboot.isFastBoot') && !(get(this, 'isPreview'))) {
      get(this, "tracking").contentImpression(id);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._trackImpression();
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (get(this, '_cachedModelId') !== get(this, 'model.id')) {
      this._trackImpression();
      set(this, '_cachedModelId', get(this, 'model.id'));
    }
  },

  showHideButton: computed('model.organizationId', function() {
    const organizationId = get(this, 'model.organizationId');

    return isPresent(organizationId) && !IsDefaultOrganization(organizationId);
  }),

  hasContactInfo: computed('model.{eventUrl,contactEmail,contactPhone}', function() {
    return isPresent(get(this, 'model.eventUrl')) || isPresent(get(this, 'model.contactEmail')) || isPresent(get(this, 'model.contactPhone'));
  }),

  nextInstance: computed('model.{futureInstances.[],scheduleInstances.[]}', function() {
    // this will go away with further model consolidation
    const scheduleInstances = get(this, 'model.scheduleInstances');
    const futureInstances = get(this, 'model.futureInstances') || [];

    if (scheduleInstances) {
      return scheduleInstances.sortBy('startsAt').get('lastObject');
    } else {
      return futureInstances.get('firstObject');
    }
  }),

  activeImage: oneWay('model.primaryOrFirstImage.imageUrl'),

  showThumbnails: computed('visibleImages.[]', function() {
    return get(this, 'visibleImages.length') > 1;
  }),

  images: alias('model.images'),
  sortedImages: sort('visibleImages', 'thumbSortDefinition'),
  visibleImages: computed('images.@each._delete', function() {
    const images = get(this, 'images');

    return images.rejectBy('_delete');
  }),

  actions: {
    chooseImage(imageUrl) {
      set(this, 'activeImage', imageUrl);
    },

    scrollToMoreContent() {
      const elem = this.$('.DetailPage-moreContent');
      const offset = (elem && elem.offset && elem.offset()) ? elem.offset().top : null;

      if (offset) {
        const scrollTo = get(this, 'scrollTo');
        if (scrollTo) {
          scrollTo(offset);
        }
      }
    },

    clickReplyButton() {
      get(this, 'tracking').trackMarketReplyButtonClick();
    },

    goingToEdit() {
      set(this, 'goingToEdit', true);
    }
  }
});
