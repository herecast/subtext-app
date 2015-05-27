import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  author: DS.attr('string'),
  contentUrl: DS.attr('string'),
  eventInstanceId: DS.attr('number'),
  content: DS.attr('string'),
  title: DS.attr('string'),
  pubdate: DS.attr('date'),

  formattedPubdate: function() {
     return moment(this.get('pubdate')).format('MM/DD/YYYY');
  }.property('pubdate')
});
