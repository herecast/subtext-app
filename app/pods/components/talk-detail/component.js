import Ember from 'ember';
import moment from 'moment';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';

const { get, computed } = Ember;

export default Ember.Component.extend(ScrollToTalk, {
  closeRoute: 'talk.all',
  closeLabel: 'Talk',

  formattedPublishedAt: computed('talk.publishedAt', function() {
    return moment(get(this, 'talk.publishedAt')).format('dddd, MMMM Do, YYYY');
  })
});
