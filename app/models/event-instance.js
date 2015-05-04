import DS from 'ember-data';

export default DS.Model.extend({
  endsAt: DS.attr('moment-date'),
  startsAt: DS.attr('moment-date'),
  subtitle: DS.attr('string')
});
