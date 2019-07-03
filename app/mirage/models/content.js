import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  schedules: hasMany('schedule'),
  eventInstances: hasMany('eventInstance'),
  comments: hasMany('comment'),
  location: belongsTo(),
  organization: belongsTo()
});
