import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import contentComments from 'subtext-ui/mixins/content-comments';

const {
  get,
  isPresent,
  inject,
  computed
} = Ember;

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, contentComments, {
  'data-test-component': 'event-detail',
  'data-test-content': computed.reads('model.contentId'),
  classNames: ['DetailPage'],
  classNameBindings: ['isPreview:isPreview'],
  model: null,
  closeRoute: 'events',
  closeLabel: 'Events',
  editPath:   'events.edit',
  editPathId: computed.oneWay('model.contentId'),
  fastboot: inject.service(),
  tracking: inject.service(),
  store: inject.service(),

  trackDetailEngagement: function() {},

  isPreview: false,
  enableStickyHeader: false,

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

  didUpdateAttrs(changes) {
    this._super(...arguments);

    const newId = get(changes, 'newAttrs.model.value.id');
    if(isPresent(newId)) {
      const oldId = get(changes, 'oldAttrs.model.value.id');
      if(newId !== oldId) {
        // we have a different model now
        this._trackImpression();
      }
    }
  },

  hasContactInfo: computed('model.eventUrl', 'model.contactEmail', 'model.contactPhone', function() {
    return isPresent(get(this, 'model.eventUrl')) || isPresent(get(this, 'model.contactEmail')) || isPresent(get(this, 'model.contactPhone'));
  }),

  nextInstance: computed('model.futureInstances.[]', 'model.scheduleInstances.[]', function() {
    // this will go away with further model consolidation
    const scheduleInstances = get(this, 'model.scheduleInstances');
    const futureInstances = get(this, 'model.futureInstances');

    if (scheduleInstances) {
      return scheduleInstances.sortBy('startsAt').get('lastObject');
    } else {
      return futureInstances.get('firstObject');
    }
  }),

  actions: {
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
    }
  }
});
