import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  adminContentUrl: DS.attr('string'),
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  contentSnippet: DS.attr('string'),
  imageUrl: DS.attr('string'),
  images: DS.attr('raw', {defaultValue: []}),
  publicationId: DS.attr('number'),
  publicationName: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),

  formattedPublishedAt: function() {
    return moment(this.get('publishedAt')).format('dddd, MMMM Do, YYYY');
  }.property('publishedAt'),

  bannerImage: function() {
    return this.get('images').findBy('primary');
  }.property('images')
});
