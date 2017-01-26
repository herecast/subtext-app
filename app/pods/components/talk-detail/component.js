import Ember from 'ember';
import moment from 'moment';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';

const { get, computed } = Ember;

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, {
  closeRoute: 'talk.all',
  closeLabel: 'Talk',

  formattedPublishedAt: computed('model.publishedAt', function() {
    return moment(get(this, 'model.publishedAt')).format('dddd, MMMM Do, YYYY');
  })
});
