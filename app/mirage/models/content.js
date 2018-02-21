import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  schedules: hasMany('schedule'),
  eventInstances: hasMany('eventInstance'),
  organization: belongsTo(),
  comments: hasMany('comment')
});
