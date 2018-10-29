import { oneWay } from '@ember/object/computed';
import DS from 'ember-data';
import moment from 'moment';

const { attr } = DS;

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

  publishedAt: oneWay('pubdate'),
  viewCount: oneWay('impressionCount')
});
