import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  schedules: hasMany('schedule'),
  organization: belongsTo('organization'),
  comments: hasMany('comment')
});
