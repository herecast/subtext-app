import { alias } from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  name: DS.attr('string'),
  listservId: DS.attr('number'),
  //listservId is old nomenclature to be changed at a later date
  digestId: alias('listservId'),
  userId: DS.attr('number'),
  confirmedAt: DS.attr('moment-date'),
  createdAt: DS.attr('moment-date'),
  unsubscribedAt: DS.attr('moment-date'),
  subscribedFromRegistration: DS.attr('boolean', { defaultValue: false })
});
