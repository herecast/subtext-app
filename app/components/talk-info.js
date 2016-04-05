import Ember from 'ember';
import moment from 'moment';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['TalkInfo'],

  formattedPublishedAt: computed('talk.publishedAt', function() {
    return moment(this.get('talk.publishedAt')).format('dddd, MMMM Do, YYYY');
  })
});
