import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  authorName: DS.attr('string'),
  contentSnippet: DS.attr('string'),
  imageUrl: DS.attr('string'),
  title: DS.attr('string'),
  publicationName: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()})
});
