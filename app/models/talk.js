import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  authorName: DS.attr('string'),
  authorImageUrl: DS.attr('string'),
  content: DS.attr('string'),
  imageUrl: DS.attr('string'),
  pageviewsCount: DS.attr('number'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  title: DS.attr('string'),
  userCount: DS.attr('number')
});