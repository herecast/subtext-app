import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  adminContentUrl: DS.attr('string'),
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  commentCount: DS.attr('number'),
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  images: DS.attr('raw', {defaultValue: []}),
  organizationId: DS.attr('number'),
  organizationName: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),

  formattedPublishedAt: function() {
    return moment(this.get('publishedAt')).format('dddd, MMMM D, YYYY');
  }.property('publishedAt'),

  bannerImage: function() {
    return this.get('images.firstObject');
  }.property('images')
});
