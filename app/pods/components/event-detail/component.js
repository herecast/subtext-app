import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';

export default Ember.Component.extend(ScrollToTalk, {
  classNames: ['DetailPage'],
  classNameBindings: ['isPreview:isPreview'],
  model: null,
  closeRoute: 'events.all',
  closeLabel: 'Events',

  actions: {
    scrollToMoreContent() {
      const elem = Ember.$('.DetailPage-moreContent');
      const offset = (elem && elem.offset && elem.offset()) ? elem.offset().top : null;

      if (offset) {
        Ember.$('.Modal').scrollTop(offset);
      }
    }
  }
});
