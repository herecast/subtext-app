import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';

const {
  get,
  isPresent,
  inject
} = Ember;

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, {
  classNames: ['DetailPage'],
  classNameBindings: ['isPreview:isPreview'],
  model: null,
  closeRoute: 'events.all',
  closeLabel: 'Events',
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
