import DS from 'ember-data';

export default DS.Model.extend({
  startsAt: DS.attr('moment-date'),
  endsAt: DS.attr('moment-date'),
});
