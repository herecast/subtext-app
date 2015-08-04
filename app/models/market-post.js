import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  content: DS.attr('string'),
  imageUrl: DS.attr('string'),
  locateAddress: DS.attr('string'),
  price: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  title: DS.attr('string')
});
