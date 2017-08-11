import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

const { attr } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  clickCount: attr('number'),
  imageUrl: attr('string'),
  redirectUrl: attr('string'),
  pubdate: attr('moment-date', {defaultValue: moment()}),
  startDate: attr('moment-date', {defaultValue: moment()}),
  title: attr('string'),
  description: attr('string'),

  campaign_start: attr('moment-date'),
  campaign_end: attr('moment-date'),
  maxImpressions: attr('number'),
  impressionCount: attr('number'),

  publishedAt: computed.oneWay('pubdate'),
  viewCount: computed.oneWay('impressionCount')
});
