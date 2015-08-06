import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['TalkInfo'],

  formattedPublishedAt: function() {
    return moment(this.get('talk.publishedAt')).format('dddd, MMMM Do, YYYY');
  }.property('talk.publishedAt')
});