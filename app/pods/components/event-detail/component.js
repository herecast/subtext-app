import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, {
  classNames: ['DetailPage'],
  classNameBindings: ['isPreview:isPreview'],
  model: null,
  closeRoute: 'events.all',
  closeLabel: 'Events',

  actions: {
    scrollToMoreContent() {
      const elem = this.$('.DetailPage-moreContent');
      const offset = (elem && elem.offset && elem.offset()) ? elem.offset().top : null;

      if (offset) {
        this.attrs.scrollTo(offset);
      }
    }
  }
});
