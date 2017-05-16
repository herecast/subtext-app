import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  name: DS.attr('string'),
  listserv: DS.belongsTo('listserv', {async: true}),
  userId: DS.attr('number'),
  confirmedAt: DS.attr('moment-date'),
  createdAt: DS.attr('moment-date'),
  unsubscribedAt: DS.attr('moment-date'),
  subscribedFromRegistration: DS.attr('boolean', { defaultValue: false })
});
