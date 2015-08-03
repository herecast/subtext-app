import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  imageUrl: DS.attr('string'),
  title: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()})
});
