import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';

const {
  get,
  isPresent,
  inject,
  computed
} = Ember;

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, {
  'data-test-component': 'event-detail',
  'data-test-content': computed.reads('model.contentId'),
  classNames: ['DetailPage'],
  classNameBindings: ['isPreview:isPreview'],
  model: null,
  closeRoute: 'events',
  closeLabel: 'Events',
  fastboot: inject.service(),
  tracking: inject.service(),
  store: inject.service(),
  isPreview: false,
  enableStickyHeader: false,

  showEditButton: computed('model.canEdit', 'fastboot.isFastBoot', function() {
    return get(this, 'model.canEdit') && ! get(this, 'fastboot.isFastBoot');
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

  feedContent: computed('model.contentId', function() {
    return get(this, 'store').findRecord('feed-content', get(this, 'model.contentId'));
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
    }
  }
});
