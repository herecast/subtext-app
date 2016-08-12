import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';

export default Ember.Component.extend(ScrollToTalk, {
  closeRoute: 'news.all',
  closeLabel: 'News',
  isPreview: false
});
