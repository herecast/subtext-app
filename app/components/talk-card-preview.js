import Ember from 'ember';
import TalkCard from 'subtext-ui/pods/components/talk-card/component';
import PreviewScroll from 'subtext-ui/mixins/components/card-preview-scroll';

const { computed } = Ember;

export default TalkCard.extend(PreviewScroll, {
  title: computed('talk.title', function() {
    const title = this.get('talk.title');

    if (Ember.isPresent(title)) {
      return title;
    } else {
      return 'A short and informative title';
    }
  })
});
