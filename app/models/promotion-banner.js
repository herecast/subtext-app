import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

const { attr } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  clickCount: attr('number'),
  imageUrl: attr('string'),
  impressionCount: attr('number'),
  pubdate: attr('moment-date', {defaultValue: moment()}),
  title: attr('string'),

  publishedAt: computed.oneWay('pubdate'),
  viewCount: computed.oneWay('impressionCount')
});
