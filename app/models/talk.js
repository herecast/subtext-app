import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  authorName: DS.attr('string'),
  authorImageUrl: DS.attr('string'),
  title: DS.attr('string'),
  pageviewsCount: DS.attr('number'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  userCount: DS.attr('number')
});
